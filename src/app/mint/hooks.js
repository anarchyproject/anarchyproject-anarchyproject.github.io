import {useAccount, useContractRead, useTransactionCount} from "wagmi";
import {readContract, signTypedData, waitForTransactionReceipt, writeContract} from '@wagmi/core';

import xACAbi from "./xAC.abi.json";
import tBTCAbi from "./tBTC.abi.json";
import {formatUnits, parseUnits} from "viem";
import {config} from "~/config";
import {useQuery} from "wagmi/query";
import {holesky} from "wagmi/chains";
import {TBTC, XAC} from "~/app/mint/units";

const xACContract = "0x36dA7c955F4895DB8837401E5d4f5CBBc24d614F";
const tBTCContract = "0x2D44161D68Ac8eBccF7Beb59FB84cBfE87Abba9A";


const oneAc = new XAC('1');
const oneTBtc = new TBTC('1');

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

  return {r, s, v};
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
  const btcForOneACContractResult = await readContract(config, {
    address: xACContract,
    abi: xACAbi,
    functionName: "calcWithdrawAmount",
    args: [oneAc.uint256Amount, totalSupply, 18],
  });

  return btcForOneACContractResult;
};

const calcBtcToAc = async (btcAmount) => {
  const amountOfAcForOneTBTC = await btcForSingleAC();

  const acAmount = (oneTBtc.uint256Amount / (amountOfAcForOneTBTC)) * btcAmount.uint256Amount;

  return acAmount / 1_000_000_000_000_00n;
};

export function useCalcACToMint(amount = oneTBtc) {
  return useQuery({
    queryKey: ["calcWithdrawAmount", amount.stringAmount],
    queryFn: () => calcBtcToAc(amount),
  });
}

export async function calcWithdrawAmountFromTBTC(btcAmount) {
  const acAmount = await calcBtcToAc(btcAmount);

  return acAmount;
}

export async function getWithdrawAmount(acAmount) {
  const totalSupply = await getTotalSupply();
  const withdrawAmount = await readContract(config, {
    address: xACContract,
    abi: xACAbi,
    functionName: "calcWithdrawAmount",
    args: [acAmount, totalSupply, 18],
  });
  return withdrawAmount;
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

export function useMintXAC(btcAmount = new TBTC('1'), setMintState) {
  const {address} = useAccount();
  const {data: nonce} = useTransactionCount({address})

  const chainId = holesky.id;

  const mintXAC = async () => {
    try {
      const acAmountWanted = await calcWithdrawAmountFromTBTC(btcAmount);
      const btcAmountToWithdraw = await getWithdrawAmount(acAmountWanted);

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

      const value = {
        owner: address,
        spender: xACContract,
        value: btcAmountToWithdraw,
        nonce: nonce,
        deadline: deadline,
      };

      const tbtcName = await getTBTCName();

      const domain = {
        name: tbtcName,
        version: "1",
        chainId: chainId,
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
      setMintState({ status: 'waitingMint' });

      const mintRes = await writeContract(config, {
        address: xACContract,
        abi: xACAbi,
        functionName: "mintWithTBTC",
        args: [deadline, sign.v, sign.r, sign.s, address, acAmountWanted],
      })
      const res = await waitForTransactionReceipt(config,{ hash: mintRes });
      setMintState({ status: 'success', payload: { hash: mintRes, amount: formatUnits(acAmountWanted, 8) } });
      return mintRes;
    } catch (e) {
      setMintState({status: 'error', payload: {message: e?.details || e?.message}});
      console.log(e?.details || e?.message);
      throw e;
    }
  };

  return {mintXAC};
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