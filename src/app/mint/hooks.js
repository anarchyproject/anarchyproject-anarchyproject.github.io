import {useAccount, useContractRead} from "wagmi";
import {readContract, getTransactionCount, signTypedData, waitForTransactionReceipt, writeContract} from '@wagmi/core';
import xACAbi from "./xAC.abi.json";
import tBTCAbi from "./tBTC.abi.json";
import xBTCAbi from "./xBTC.abi.json";
import {formatUnits, parseUnits} from "viem";
import {config} from "~/config";
import {useQuery} from "wagmi/query";
import {queryClient} from "~/app/layout";

const xACContract = "0x3d0bca3c3126858DEfFE1586E667Eb5cCaEE9B0e";
const tBTCContract = "0x2D44161D68Ac8eBccF7Beb59FB84cBfE87Abba9A";
const xBTCContract = '0x77B4E87A28B26DBEc5957E9A599dB93AAC70Ae37';


function splitSignature(signature) {
  if (signature.length !== 132) {
    throw new Error("Invalid signature length");
  }

  if (signature.startsWith("0x")) {
    signature = signature.slice(2);
  }

  const r = "0x" + signature.slice(0, 64);
  const s = "0x" + signature.slice(64, 128);
  const v = parseInt(signature.slice(128, 130), 16);

  return {r, s, v};
}

export const useGetTotalBtcBurned = () => {
  const getBtcBurned = async () => readContract(config,{
    address: xACContract,
    abi: xACAbi,
    functionName: "btcBurned",
    args: [],
  });

  return useQuery({
    queryKey: ["btcBurned"],
    queryFn: () => getBtcBurned(),
  })
}

const getTotalSupply = async () => {
  const totalSupply = await readContract(config,
    {
      address: xACContract,
      abi: xACAbi,
      functionName: "totalSupply",
      args: [],
    }
  );

  return totalSupply;
};

export async function getWithdrawAmount(acAmount, decimals) {
  const totalSupply = await getTotalSupply();
  const withdrawAmount = await readContract(config, {
    address: xACContract,
    abi: xACAbi,
    functionName: "calcWithdrawAmount",
    args: [acAmount, totalSupply, decimals],
  });
  return withdrawAmount;
}

export function useGetTotalSupply () {
  return useQuery({
    queryKey: ["totalSupply"],
    queryFn: () => getTotalSupply(),
  })
}

export function useWithdrawAmount(acAmount, decimals) {
  return useQuery({
    queryKey: ["calcWithdrawAmount", acAmount.toString(), decimals.toString()],
    queryFn: () => getWithdrawAmount(parseUnits(acAmount, 4), decimals),
  })
}

export async function getTBTCName() {
  const name = await readContract(config, {
    address: tBTCContract,
    abi: tBTCAbi,
    functionName: "name",
    args: [],
  });
  return name;
}

function resetCounters() {
  queryClient.invalidateQueries({
    queryKey: ["balanceOf"],
  });
  queryClient.invalidateQueries({
    queryKey: ["totalSupply"],
  });
  queryClient.invalidateQueries({
    queryKey: ["btcBurned"],
  });
}

export function useMintXACWBTC(acToMint, setMintState) {
  const address = useAccount().address;

  const mintXACWithXBTC = async () => {
    try {
      setMintState({status: 'waitingApproval'});
      const withdrawAmount = await getWithdrawAmount(acToMint, 8)
      const approvalRes = await writeContract(config, {
        abi: xBTCAbi,
        address: xBTCContract,
        functionName: "approve",
        args: [xACContract, withdrawAmount],
      });

      await waitForTransactionReceipt(config, {hash: approvalRes});

      setMintState({status: 'waitingMint'});
      const mintRes = await writeContract(config, {
        abi: xACAbi,
        address: xACContract,
        functionName: "mintWithWBTC",
        args: [address, acToMint],
      });

      const txRec2 = await waitForTransactionReceipt(config, {hash: mintRes});

      setMintState({status: 'success', payload: {hash: mintRes, amount: formatUnits(acToMint, 4)}});
      resetCounters();
      return txRec2;
    } catch (e) {
      setMintState({status: 'error', payload: {message: e?.details || e?.message}});
      console.log(e.message);
    }
  };

  return {mintXACWithXBTC};
}


export const mintXAC = async (address, acToMint, setMintState, addToNonce = 0) => {
  if (Math.abs(addToNonce) > 2) {
    setMintState({status: 'error', payload: {message: "Nonce overflow; Probably too many pending transactions"}});
    return;
  }
  try {
    const btcAmountToWithdraw = await getWithdrawAmount(acToMint, 18);

    setMintState({status: 'waitingApproval'});
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);

    const types = {
      Permit: [
        {name: "owner", type: "address"},
        {name: "spender", type: "address"},
        {name: "value", type: "uint256"},
        {name: "nonce", type: "uint256"},
        {name: "deadline", type: "uint256"},
      ],
    };

    const nonce = await getTransactionCount(config, {address});

    const value = {
      owner: address,
      spender: xACContract,
      value: btcAmountToWithdraw,
      nonce: nonce + addToNonce,
      deadline: deadline,
    };

    const tbtcName = await getTBTCName();

    const domain = {
      name: tbtcName,
      version: "1",
      chainId: config.chains[0].id,
      verifyingContract: tBTCContract,
    };

    const signature = await signTypedData(config,
      {
        account: address,
        primaryType: 'Permit',
        domain,
        types,
        message: value,
      });
    const sign = splitSignature(signature);
    setMintState({status: 'waitingMint'});

    const mintRes = await writeContract(config, {
      address: xACContract,
      abi: xACAbi,
      functionName: "mintWithTBTC",
      args: [deadline, sign.v, sign.r, sign.s, address, acToMint],
    })
    await waitForTransactionReceipt(config, {hash: mintRes});
    setMintState({status: 'success', payload: {hash: mintRes, amount: formatUnits(acToMint, 4)}});
    resetCounters();
    return mintRes;
  } catch (e) {
    if (e?.details?.includes('ERC2612InvalidSigner') || e.message?.includes('ERC2612InvalidSigner')) {
      await mintXAC(address, acToMint, setMintState, -1);
      return;
    }
    setMintState({status: 'error', payload: {message: e?.details || e?.message}});
    console.log(e?.details || e?.message);
  }
};


export const useAcBalance = (address) => {
  const {data: balance} = useContractRead({
    address: xACContract,
    abi: xACAbi,
    functionName: "balanceOf",
    args: [address],
  });

  return balance ? formatUnits(balance, 4) : 0;
}
