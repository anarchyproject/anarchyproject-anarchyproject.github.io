"use client";

import { useConnect } from 'wagmi'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi';
import {useCalcWithdrawAmount, useGetMYBTCAmount, useMintXAC, useMintXBTC, useTotalSupply} from "~/app/mint/hooks";
import {useState} from "react";
import {formatEther, formatUnits, parseEther, parseUnits} from "viem";
import {Modal} from "~/components/modal";

export function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName })

  return (
    <div className="flex flex-col bg-default-bg border border-gray-500 gap-3 mx-auto p-2">
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
      <button className="boder border-gray-50 border bg-gray-700" onClick={() => disconnect()}>Disconnect</button>
    </div>
  )
}

export function WalletOptions() {
  const { connectors, connect } = useConnect()

  return (<Modal>
    <div className="flex flex-col gap-5">
  {connectors.map((connector) => (
    <button className="p-4 border border-gray-50 bg-default-bg"  key={connector.uid} onClick={() => connect({ connector })}>
      {connector.name}
    </button>))}
    </div>
  </Modal>);
}

function Block({ title, icon, children }) {
  return (
    <div className="flex flex-col gap-8 border border-[#6424247A] p-10 shadow-squareDefault xl:w-[560px] xl:pb-6">
      <div className="flex w-full items-center justify-between gap-4 xl:gap-0">
        <span className="font-bios text-base xl:text-nowrap xl:text-xl">{title}</span>
        {icon}
      </div>
      {children}
    </div>
  );
}

function Icon({ path }) {
  return (
    <img className="h-[32px] w-[32px]" src={path} alt="icon"/>
  );
}

export default function Mint() {
  const [btcAmount, setBtcAmount] = useState("0.0001");
  const { data: totalSupply} = useTotalSupply();
  const { data: withdrawAmount } = useCalcWithdrawAmount(parseUnits(btcAmount, 8));
  const { mintXBTC } = useMintXBTC();
  const isConnected = useAccount().isConnected;
  const { mintXAC } = useMintXAC(parseUnits(btcAmount, 8));

  return (
    <div className="flex flex-col text-white">
      {isConnected ? <Account /> : <WalletOptions />}
      <div className="flex flex-col justify-center gap-12 p-5 text-white md:flex-row">
        <div className="flex flex-col justify-between gap-12">
          <Block icon={<Icon path="/icons/BTC.svg"/>} title="Total BTC Burnt">
            <span className="font-bios text-[#cc6600] xl:text-[28px]">4.102 643 204</span>
          </Block>
          <Block icon={<Icon path="/icons/AC.svg"/>} title="Total AC Minted">
            <span className="font-bios text-[#cc6600] xl:text-[28px]">{formatUnits(totalSupply || BigInt(1), 4)}</span>
          </Block>
        </div>
        <Block
          title="I'm gonna burn my BTC"
          icon={<Icon path="/icons/burn.svg"/>}
        >
          <div className="flex flex-col gap-6 font-bios xl:h-full">
            <div className="flex flex-col gap-4">
              <div className="font-sans text-xs text-[#ffffff59]">Insert the amount you’d like to burn.</div>
              <div className="relative w-full">
                <p className="absolute left-2 top-1/2 z-10 -translate-y-1/2 transform font-bios text-white">
                  BTC
                </p>
                <input
                  type="number"
                  value={btcAmount}
                  onChange={(e) => setBtcAmount(e.target.value)}
                  className="h-[52px] w-full bg-[#272829] p-4 pl-[72px] text-base text-white"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <span>To mint</span>
              <div className="flex gap-6 pl-2 text-[#00AA00]">
                <span>AC</span>
                <span>{(withdrawAmount && formatUnits(withdrawAmount, 4)) || 0}</span>
              </div>
            </div>
            <button
              type="button"
              className="rounded-sm bg-red-bg py-2 font-bios text-lg uppercase xl:h-[60px] xl:justify-self-end"
              onClick={mintXAC}
            >
              Burn BTC
            </button>
          </div>
        </Block>
      </div>
    </div>
  );
}

