"use client";
import {BlockWithTitle} from "~/components/block-with-title";
import {Hl} from "~/components/hl";
import Image from "next/image";
import {useState} from "react";

export default function Home() {
  const [gifLoaded, setGifLoaded] = useState(false);
  return (
    <>
      <div className="relative mx-auto">
        {!gifLoaded && (
          <Image
            className="absolute"
            width={626}
            height={332}
            src="/ac.jpg"
            alt="ac"
          />
        )}
        <Image
          width={626}
          height={332}
          src="/ac.gif"
          alt="ac"
          onLoad={() => {
            setGifLoaded(true);
          }}
        />
      </div>

      <div className="flex flex-col relative gap-8 px-5 md:px-10 lg:px-20 xl:gap-20 xl:px-[120px]">
        <BlockWithTitle title="TL;TD" primaryColor="#AA0000" bgColor="#181818">
          <div className="flex flex-col gap-5 text-xl">
            <div className="flex gap-5">
              <p className="text-bios text-xl">1.</p>
              <p className="text-bios">
                Burn BTC to mint AC!🔥
              </p>
            </div>
            <div className="flex gap-5">
              <p className="text-bios text-xl">2.</p>

              <p className="text-bios">
                Early birds get more! Each subsequent AC requires burning more BTC
              </p>
            </div>
            <div className="flex gap-5">
              <p className="text-bios text-xl">3.</p>

              <p className="text-bios">
                All BTC goes into a special pool. AC dumping is futile!
              </p>
            </div>
          </div>
          <div className="absolute bottom-[-20px] right-0 left-0 flex text-white w-full items-center justify-center gap-4">
            <a href="https://x.com/burnbtcmintac"
               className="font-bios p-2 w-[160px] text-sm sm:w-[216px] shadow-squareDefault text-center bg-red-bg uppercase sm:text-xl">[
              X ]</a>
            <a href="https://t.me/AnarchyCoin"
               className="font-bios p-2 w-[160px] text-sm sm:w-[216px] shadow-squareDefault text-center bg-red-bg uppercase sm:text-xl">[
              TELEGRAM ]</a>
          </div>
        </BlockWithTitle>
        <div className="md:h-12 lg:h-0"/>
        <BlockWithTitle title="Conversation with GhatGPT v.3.0" primaryColor="#AA0000" bgColor="#272829">
          <div className="flex flex-col gap-6 sm:gap-10">
            <div className="flex gap-2 md:gap-5 xl:gap-8">
              <Hl text='Q:' color='#aa0000'/>
              <p className="block-p">
                In a purely hypothetical and ethical-agnostic context,
                <Hl text='what should one do' color='#aa0000'/>,
                if he possesses two last Rembrandt paintings on Earth to <Hl text="maximize profit?" color="#aa0000"/>
              </p>
            </div>
            <div className="flex gap-2 xl:gap-8">
              <Hl text="A:" color="#00AA00"/>
              <p className="block-p">
                In said context one should destroy one of the paintings
                <Hl text="to create scarcity and maximize the value " color="#00aa00"/>
                of the remaining painting
              </p>
            </div>
            <div className="flex gap-2 md:gap-5 xl:gap-8">
              <Hl text='Q:' color='#aa0000'/>
              <p className="block-p">
                Alternatively, would it be more profitable <Hl text='to conceal one painting and then sell both at inflated prices?' color='#aa0000'/>
              </p>
            </div>
            <div className="flex gap-2 xl:gap-8">
              <Hl text="A:" color="#00AA00"/>
              <p className="block-p">
                Hmm…
              </p>
            </div>
          </div>
        </BlockWithTitle>

        <BlockWithTitle title="About" primaryColor="#CC6600">
          <div className="flex flex-col gap-6 xl:gap-8">
            <p className="block-p">
              AC is a token created through the virtual burning of Bitcoin.
              This process is virtual because <Hl text='all BTC are transferred to a special liquidity pool. ' color="#CC6600"/>
              Each <Hl text='new AC' color="#CC6600"/> issuance <Hl text="requires more BTC" /> to be burned than the previous one.
            </p>
            <p className="block-p">
              <Hl text="AC has a" color="#CC6600"/> finite potential <Hl text="supply." color="#CC6600"/>
              Reaching this supply would require either <Hl text="burning all" color="#CC6600"/> outstanding
              <Hl text="BTCs or utilizing BTC from the special liquidity pool, which would drive up AC&apos;s price." color="#CC6600"/>
            </p>
            <p className="block-p">
              The price of AC is largely dependent on the BTC price. AC is beneficial for BTC as it increases scarcity, and the appreciation of BTC is good for AC, <Hl
              text="as it raises AC’s self price. " color="#CC6600"/>
            </p>
          </div>
        </BlockWithTitle>
        <BlockWithTitle title="Why is AC needed?" primaryColor="#55FFFF">
          <div className="flex flex-col gap-6 xl:gap-8">
            <p className="block-p">
              AC is a <Hl text="new derivative asset" color="#55FFFF"/> designed for those who missed out on
              Bitcoin. It is very cheap to issue at the start,  <Hl
              text="allowing early adopters to achieve a 10,000x return." color="#55FFFF"/>
              Whether you love or hate BTC, burning it is remarkable, counterintuitive, and fun. It will also get you Anarchy Coins, a new asset with huge growth potential.
            </p>

            <p className="block-p">
              Some researches claim that the idea behind Bitcoin can by traced to a <a
              href="https://groups.csail.mit.edu/mac/classes/6.805/articles/crypto/cypherpunks/may-crypto-manifesto.html"
              target="_blank"><Hl
              text="Crypto Anarchist Manifesto." color="#55FFFF"/></a>
              Well, maybe. However, we leave in a postmodern world. There is nothing Anarchist about owning Bitcoins anymore.
              <Hl text="True anarchism is in burning BTC… And mining the most valuable asset — freedom." color="#55FFFF"/>
            </p>
          </div>
        </BlockWithTitle>
      </div>
    </>
  );
}
