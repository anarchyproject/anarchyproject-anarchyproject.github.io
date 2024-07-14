import {useAccount, useContractRead, useContractWrite} from "wagmi";
import {waitForTransactionReceipt, writeContract} from '@wagmi/core';

import xACAbi from "./xAC.abi.json";
import xBTCAbi from "./xBTC.abi.json";
import {formatEther, parseEther, parseUnits} from "viem";
import {config} from "~/config";

const xACContract = "0x77B4E87A28B26DBEc5957E9A599dB93AAC70Ae37";
const xBTCContract = "0x2d44161d68ac8ebccf7beb59fb84cbfe87abba9a";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const useTotalSupply = () => {
  return useContractRead({
    address: xACContract,
    abi: xACAbi,
    functionName: "totalSupply",
    args: [],
  })
}

export function useCalcWithdrawAmount(amount = parseEther("1")) {
  const {data: totalSupply} = useTotalSupply();
  const res = useContractRead({
    address: xACContract,
      abi: xACAbi,
    functionName: "calcWithdrowAmount",
    args: [amount, totalSupply],
  });

  return res
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

  return { mintXBTC };
}

export function useMintXAC(amount = parseUnits("1", 8)) {
  const address = useAccount().address;

  const mintXAC = async () => {
    try {
      const approvalRes= await writeContract(config,{
        abi: xBTCAbi,
        address: xBTCContract,
        functionName: "approve",
        args: [xACContract, amount],
      });

      const txRec = await waitForTransactionReceipt(config, {hash: approvalRes});

      const mintRes = await writeContract(config, {
        abi: xACAbi,
        address: xACContract,
        functionName: "mint",
        args: [address, amount],
      });
    } catch (e) {
      console.log(e);
    }
  };

  return { mintXAC };
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