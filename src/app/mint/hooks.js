import {
  useAccount,
  useContractRead,
  useContractWrite,
  useSignMessage,
  useSignTypedData,
  useTransactionCount
} from "wagmi";
import {readContract, waitForTransactionReceipt, writeContract, signTypedData} from '@wagmi/core';

import xACAbi from "./xAC.abi.json";
import xBTCAbi from "./xBTC.abi.json";
import tBTCAbi from "./tBTC.abi.json";
import {formatEther, formatUnits, parseEther, parseUnits} from "viem";
import {config} from "~/config";
import {useQuery} from "wagmi/query";
import {holesky} from "wagmi/chains";

const xACContract = "0x36dA7c955F4895DB8837401E5d4f5CBBc24d614F";
const xBTCContract = "0x2d44161d68ac8ebccf7beb59fb84cbfe87abba9a";
const tBTCContract = "0xD491a0BCd98f331d51c86826e25310d765FbAc4c";
const ONE_AC = parseUnits('1', 4);
const ONE_BTC = parseUnits('1', 18);

function splitSignature(signature) {
  // Проверяем, что подпись имеет правильную длину
  if (signature.length !== 132) {
    throw new Error("Invalid signature length");
  }

  // Убираем префикс "0x", если он есть
  if (signature.startsWith("0x")) {
    signature = signature.slice(2);
  }

  // Извлекаем r, s и v
  const r = "0x" + signature.slice(0, 64);
  const s = "0x" + signature.slice(64, 128);
  const v = parseInt(signature.slice(128, 130), 16);

  return { r, s, v };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const useTotalSupply = () => {
  return useContractRead({
    address: xACContract,
    abi: xACAbi,
    functionName: "totalSupply",
    args: [],
  })
}

export const useGetTotalBtcBurned = () => {
  return useContractRead({
    address: xACContract,
    abi: xACAbi,
    functionName: "btcBurned",
    args: [],
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

const btcForSingleAC = async () => {
  const totalSupply = await getTotalSupply();
  console.log({totalSupply})

  try {

    const btcForOneAC = await readContract(config, {
      address: xACContract,
      abi: xACAbi,
      functionName: "calcWithdrawAmount",
      args: [ONE_AC, totalSupply, 18],
    });

    console.log({btcForOneAC})

    return btcForOneAC;
  } catch (e) {
    console.log(e);
  }
};

const calcBtcToAc = async (btcAmount) => {
  const BTCForOneAc = await btcForSingleAC();
  const btcRate = ONE_BTC / BTCForOneAc;
  const acAmount = (ONE_BTC / BTCForOneAc) * btcAmount;
  return acAmount;
};

export function useCalcWithdrawAmount(amount = parseUnits("1", 8)) {
  return useQuery({
    queryKey: ["calcWithdrawAmount", formatUnits(amount, 8)],
    queryFn: () => calcBtcToAc(amount),
  });
}

export function useMintXAC(btcAmount = '1', setMintState) {
  const {address} = useAccount();
  const {data: nonce } = useTransactionCount({ address })

  const totalSupply = useTotalSupply();

  const chainId = holesky.id;
  const parseBtcAmount = parseUnits(btcAmount, 18)
  const {data: withdrawAmount} = useCalcWithdrawAmount(parseBtcAmount);

  const mintXAC = async () => {
    try {
      setMintState({status: 'waitingApproval'});
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);
      // const btcName = await readContract(config, {
      //   address: tBTCContract,
      //   abi: tBTCAbi,
      //   functionName: "name",
      // });
      console.log({deadline})
      // console.log({btcName})

      const types = {
        Permit: [
          {name: "owner", type: "address"},
          {name: "spender", type: "address"},
          {name: "value", type: "uint256"},
          {name: "nonce", type: "uint256"},
          {name: "deadline", type: "uint256"},
        ],
      };

      const value = {
        owner: tBTCContract,
        spender: address,
        value: parseInt(btcAmount, 10),
        nonce: nonce,
        deadline: deadline,
      };

      const domain = {
        name: 'tBTC',
        version: "1",
        chainId: chainId,
        verifyingContract: tBTCContract,
      };

      console.log({domain});
      const signature = await signTypedData(config,
        {
          account: address,
          primaryType: 'Permit',
          domain,
          types,
          message: value,
        });
      console.log({ signature });
      const sign = splitSignature(signature);
      console.log({sign})
      console.log([deadline, sign.v, sign.r, sign.s, address, parseBtcAmount])

      const mintRes = await writeContract(config, {
        address: xACContract,
        abi: xACAbi,
        functionName: "mintWithTBTC",
        args: [deadline, sign.v, sign.r, sign.s, address, parseBtcAmount],
      })
      console.log({mintRes})
    } catch (e) {
      setMintState({status: 'error', payload: {message: e?.details || e?.message}});
      console.log(e?.details || e?.message);
      throw e;
    }
  };

  return {mintXAC};
}

export const useGetMYBTCAmount = () => {
  const address = useAccount().address;
  return useContractRead({
    address: xBTCContract,
    abi: xBTCAbi,
    functionName: "balanceOf",
    args: [address],
  })
}

export const useAcBalance = (address) => {
  const {data: balance} = useContractRead({
    address: xACContract,
    abi: xACAbi,
    functionName: "balanceOf",
    args: [address],
  });

  return balance ? formatUnits(balance, 8) : 0;
}