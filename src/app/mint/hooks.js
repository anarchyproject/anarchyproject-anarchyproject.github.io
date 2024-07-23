import {useAccount, useContractRead, useContractWrite} from "wagmi";
import {readContract, waitForTransactionReceipt, writeContract} from '@wagmi/core';

import xACAbi from "./xAC.abi.json";
import xBTCAbi from "./xBTC.abi.json";
import {formatEther, formatUnits, parseEther, parseUnits} from "viem";
import {config} from "~/config";
import {useQuery} from "wagmi/query";

const xACContract = "0x1b9b4F406DBeFa33d47fF342134A2765E90Ac37e";
const xBTCContract = "0x2d44161d68ac8ebccf7beb59fb84cbfe87abba9a";
const ONE_AC = parseUnits('1', 4);
const ONE_BTC = parseUnits('1', 8);

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
  const res = await readContract(config,
    {
      address: xACContract,
      abi: xACAbi,
      functionName: "totalSupply",
      args: [],
    }
  );

  return res;
};

const btcForSingleAC = async () => {
  const totalSupply = await getTotalSupply();

  try {

    const btcForOneAC = await readContract(config, {
      address: xACContract,
      abi: xACAbi,
      functionName: "calcWithdrowAmount",
      args: [ONE_AC, totalSupply],
    });

    console.log({btcForOneAC})

    return btcForOneAC;
  } catch (e) {
    console.log({e})
  }
};

const calcBtcToAc = async (btcAmount) => {
  const BTCForOneAc = await btcForSingleAC();
  const btcRate = ONE_BTC / BTCForOneAc;
  console.log({btcRate})
  console.log({btcAmount})

  const acAmount = (ONE_BTC / BTCForOneAc) * btcAmount;
  console.log({acAmount})
  return acAmount;
};

export function useCalcWithdrawAmount(amount = parseUnits("1", 8)) {
  return useQuery({
    queryKey: ["calcWithdrawAmount", formatUnits(amount, 8)],
    queryFn: () => calcBtcToAc(amount),
  });
}

export function useMintXBTC(amount = parseEther("1")) {
  const {writeContract} = useContractWrite();
  const address = useAccount().address;

  const mintXBTC = async () => {
    const res = await writeContract({
      abi: xBTCAbi,
      address: xBTCContract,
      functionName: "mint",
      args: [xACContract, amount],
    });

    return res;
  };

  return {mintXBTC};
}

export function useMintXAC(amount = parseUnits("1", 8)) {
  const address = useAccount().address;

  const mintXAC = async () => {
    try {
      const approvalRes = await writeContract(config, {
        abi: xBTCAbi,
        address: xBTCContract,
        functionName: "approve",
        args: [xACContract, amount],
      });
      const acAmount = await calcBtcToAc(amount);
      const txRec = await waitForTransactionReceipt(config, {hash: approvalRes});

      const mintRes = await writeContract(config, {
        abi: xACAbi,
        address: xACContract,
        functionName: "mint",
        args: [address, parseUnits('1', 4)],
      });
      console.log({mintRes})
    } catch (e) {
      console.log(e);
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
  console.log(balance)

  return balance ? formatUnits(balance, 8) : 0;
}