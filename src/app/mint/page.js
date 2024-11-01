"use client";

import {
  mintXAC,
  useGetTotalBtcBurned,
  useMintXACWBTC,
  useTotalSupply,
  useWithdrawAmount
} from "~/app/mint/hooks";
import {config} from '~/config';
import {useState} from "react";
import {formatUnits, parseUnits} from "viem";
import {Modal} from "~/components/modal";
import Image from 'next/image';
import {useAccount, useTransactionCount} from "wagmi";

const telegramIcon = '/icon-telegram.svg';
const twitterIcon = '/icon-twitter.svg';

function Block({title, icon, children}) {
  return (
    <div
      className="flex bg-[#181818] flex-col gap-8 border border-[#6424247A] p-10 shadow-squareDefault xl:w-[560px] xl:pb-6">
      <div className="flex w-full items-center justify-between gap-4 xl:gap-0">
        <span className="font-bios text-base xl:text-nowrap xl:text-xl">{title}</span>
        {icon}
      </div>
      {children}
    </div>
  );
}

function Icon({path}) {
  return (
    <img className="h-[32px] w-[32px]" src={path} alt="icon"/>
  );
}

function MintWaitingModal({state, setState}) {
  const text = state.status === 'waitingMint' ? 'We are minting your Anarchy Coins' : 'To continue sign the transaction in your wallet';

  if (state.status === 'idle' || state.status === 'error' || state.status === 'success') {
    return null;
  }

  return (
    <Modal setIsOpen={() => setState({status: 'idle'})}>
      <div className="font-bios flex flex-col items-center justify-center">
        <div
          className="m-4 h-[48px] w-[48px] animate-spin self-center rounded-full border-[2px] border-[#f3f3f3] border-t-[gray] bg-[50%]"></div>
        <div className="font-bold my-5">Waiting</div>
        <div className="max-w-[460px] font-sans text-center">{text}</div>
      </div>
    </Modal>
  );
}

function MintErrorModal({state, setState}) {
  if (state.status !== 'error') {
    return null;
  }

  return (
    <Modal setIsOpen={() => setState({status: 'idle'})}>
      <div className="font-bios flex flex-col items-center justify-center">
        <div
          className="m-4 h-[48px] w-[48px] animate-spin self-center rounded-full border-[2px] border-[#f3f3f3] border-t-[gray] bg-[50%]"></div>
        <div className="font-bold my-5">Error</div>
        <div className="max-w-[460px] text-wrap break-words text-[#aa0000] font-bios text-center">{state?.payload?.message}</div>
      </div>
    </Modal>
  );
}

const shortenHash = (hash) => hash?.slice(0, 6) + '...' + hash?.slice(-6);

function MintSuccessModal({state, setState}) {
  if (state.status !== 'success') {
    return null;
  }

  const shareText = `I just minted ${state?.payload?.amount} ACs on Anarchy Coin.`;

  const encodedUrl = window.location.href;

  return (
    <Modal setIsOpen={() => setState({status: 'idle'})}>
      <div className="font-bios flex flex-col gap-1 items-center justify-center">
        <div className="bg-[#181818] border border-[#642424] relative shadow-squareDefault flex flex-col mb-6">
          <Image src="/joker.webp" alt="joker" width={210} height={210}/>
        </div>
        <div className="font-bold max-[428px] self-center mb-4">You successfully
          minted <br/> {state?.payload?.amount} Anarchy Coins
        </div>
        <div className="flex justify-between w-full font-sans">
          <div className="text-[#ffffff80]">Status</div>
          <div className="text-[#ffffff80]">Transaction hash</div>
        </div>
        <div className="flex justify-between w-full">
          <div className="text-[#00aa00]">Confirmed</div>
          <a href={`${config.chains[0].blockExplorers?.default[0]}/tx/${state?.payload?.hash}`} className="text-[#00aa00]">{shortenHash(state?.payload?.hash)}</a>
        </div>
        <div className="flex items-center justify-center gap-8">
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`}
            target="_blank"
            className="flex cursor-pointer flex-col gap-2 items-center justify-center"
          >
            <div className="flex h-[43px] w-[43px] items-center justify-center rounded-lg bg-[#ffffff14]">
              <Image width={16} height={17} src={twitterIcon} alt="twitter"/>
            </div>
            <p className="text-[#ffffff80]">X</p>
          </a>
          <a
            href={`https://t.me/share/url?url=${encodedUrl}&text=${shareText}`}
            target="_blank"
            className="flex cursor-pointer gap-2 flex-col items-center justify-center"
          >
            <div className="flex h-[43px] w-[43px] items-center justify-center rounded-lg bg-[#ffffff14]">
              <Image width={18} height={15} src={telegramIcon} alt="telegram"/>
            </div>
            <p className="text-[#ffffff80]">Telegram</p>
          </a>
        </div>
        <button className="font-bios mt-4 bg-red-bg w-full p-4" onClick={() => setState({status: 'idle'})}>MINT MORE
        </button>
      </div>
    </Modal>
  );
}

export default function Mint() {
  const [btcType, setBtcType] = useState("tBTC");
  const [acToMint, setACToMint] = useState("1");
  const isConnected = useAccount().isConnected;
  const {data: totalSupply} = useTotalSupply();
  const btcDecimals = btcType === "tBTC" ? 18 : 8;
  const address = useAccount()?.address;

  const [mintState, setMintState] = useState({status: 'idle'});


  const mintClick = () => {
    if (!isConnected) {
      // TODO
    }
    if (btcType === "tBTC") {
      mintXACWithTBTC();
    } else {
      mintXACWithXBTC();
    }
  }

  const mintXACWithTBTC = () => mintXAC(address, parseUnits(acToMint, 4), setMintState);

  const {mintXACWithXBTC} = useMintXACWBTC(parseUnits(acToMint, 4), setMintState);
  const {data: btcBurned} = useGetTotalBtcBurned();
  const {data: withdrawAmount} = useWithdrawAmount(acToMint, btcDecimals);

  return (
    <div className="flex flex-col p-8 text-white bg-mint" style={{ backgroundImage: "url('/bg_1440.png')", backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', backgroundPositionX: "center"}}>
      <MintWaitingModal state={mintState} setState={setMintState}/>
      <MintSuccessModal state={mintState} setState={setMintState}/>
      <MintErrorModal state={mintState} setState={setMintState}/>

      <div className="flex flex-col justify-center gap-12 p-5 text-white md:flex-row">
        <div className="flex flex-col bg-[#181818] justify-between gap-12">
          <Block icon={<Icon path="/icons/BTC.svg"/>} title="Total BTC Burnt">
            <span className="font-bios text-[#cc6600] xl:text-[28px]">{formatUnits(btcBurned || BigInt(0), 18)}</span>
          </Block>
          <Block icon={<Icon path="/icons/AC.svg"/>} title="Total AC Minted">
            <span
              className="font-bios text-[#cc6600] xl:text-[28px]">{totalSupply ? formatUnits(totalSupply, 4) : 0}</span>
          </Block>
        </div>
        <Block
          title="I'm Gonna Mint AC"
          icon={<Icon path="/icons/ac_mint.svg"/>}
        >
          <div className="flex flex-col gap-6 font-bios xl:h-full">
            <div className="flex flex-col gap-4">
              <div className="font-sans text-xs text-[#ffffff59]">Insert the amount you’d like to mint.</div>
              <div className="relative w-full">
                <p className="absolute left-2 top-1/2 z-10 -translate-y-1/2 transform font-bios text-white">
                  AC
                </p>
                <input
                  type="number"
                  value={acToMint}
                  onChange={(e) => setACToMint(e.target.value)}
                  className="h-[52px] w-full bg-[#272829] p-4 pl-[72px] text-base text-white"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 items-center">
                <span>And ready to burn </span>
                <select
                  value={btcType}
                  onChange={(e) => setBtcType(e.target.value)}
                  className="h-[52px] bg-[#272829] p-1 text-base text-white"
                >
                  <option value="tBTC">{btcType === "tBTC" ? "✓tBTC" : "tBTC"}</option>
                  <option value="wBTC">{btcType === "wBTC" ? "✓wBTC" : "wBTC"}</option>
                </select>
              </div>
              <div className="flex gap-6 text-[#00AA00]">
                <span>BTC</span>
                <span className="pl-2">{withdrawAmount ? formatUnits(withdrawAmount, btcDecimals) : 0}</span>
              </div>
            </div>
            <button
              disabled={withdrawAmount <= 0}
              type="button"
              className="rounded-sm bg-red-bg py-2 font-bios text-lg uppercase xl:h-[60px] xl:justify-self-end disabled:bg-[#272829] disabled:cursor-not-allowed"
              onClick={mintClick}
            >
              Burn BTC
            </button>
          </div>
        </Block>
      </div>
    </div>
  );
}

