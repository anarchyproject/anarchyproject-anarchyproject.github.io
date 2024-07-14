"use client";
import {WarningBlock} from "~/components/warning-block";
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

      <div className="flex flex-col gap-8 px-5 md:px-10 lg:px-20 xl:gap-20 xl:px-[120px]">
        <BlockWithTitle title="TL;TD" primaryColor="#AA0000" bgColor="#181818">
          <div className="flex flex-col gap-5 text-xl">
            <div className="flex gap-5">
              <p className="text-bios text-xl">1.</p>
              <p className="text-bios">
                Burn BTC to mint AC!
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
                Double benefit! Burn BTC to support scarcity and earn from AC&apos;s rise
              </p>
            </div>
            {/*<h1 className="absolute bottom-[-15%] sm:bottom-[-20%] lg:bottom-[-13%] left-1/4 mx-auto my-4 flex justify-center">*/}
            {/*  <WarningBlock>! MINT ANARCHY COIN !</WarningBlock>*/}
            {/*</h1>*/}
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
          </div>
        </BlockWithTitle>

        <BlockWithTitle title="About" primaryColor="#CC6600">
          <div className="flex flex-col gap-6 xl:gap-8">
            <p className="block-p">
              AC is the token created as a result of the proven burning of Bitcoin. The issuance process
              may be described as <Hl text="virtual mining," color="#CC6600"/> with Bitcoin playing the role
              of electricity. The issuance of each <Hl text="new AC requires more BTC" color="#CC6600"/> to be
              burned than for the previous one.
            </p>
            <p className="block-p">
              AC has a finite potential supply, but reaching it would necessitate burning all outstanding
              BTCs, which is not practically feasible. AC derives its value from the value of burned
              Bitcoin, similar to how Bitcoin derives its value from the cost of the electricity necessary
              to mine it,
              <Hl text=" similar to how Gold derives its value from the cost of mining." color="#CC6600"/>
            </p>
            <p className="block-p">
              The price of AC is largely dependent on the BTC price. AC is beneficial for Bitcoin as it
              increases scarcity, and the appreciation of Bitcoin is good for AC, <Hl
              text="as it raises AC’s self price." color="#CC6600"/>
            </p>
          </div>
        </BlockWithTitle>
        <BlockWithTitle title="Why is AC needed?" primaryColor="#55FFFF">
          <div className="flex flex-col gap-6 xl:gap-8">
            <p className="block-p">
              AC is a <Hl text="new derivative asset" color="#55FFFF"/> designed for those who missed out on
              Bitcoin. It is very cheap to issue at the start, allowing early adopters <Hl
              text="the chance to achieve a 10,000x return." color="#55FFFF"/> Whether you love BTC or hate it, burning
              it is cool, counter intuitive, and fun. It will also
              get you Anarchy Coins — a new asset with huge growth potential. Additionally, burning BTC drives
              its price up.
            </p>

            <p className="block-p">
              Some researches claim that the idea behind Bitcoin can by traced to a <a
              href="https://groups.csail.mit.edu/mac/classes/6.805/articles/crypto/cypherpunks/may-crypto-manifesto.html"
              target="_blank"><Hl
              text="Crypto Anarchist Manifesto." color="#55FFFF"/></a>
              Well, maybe. However we leave in a post-modern world. There is nothing Anarchist in owning Bitcoins
              anymore — so do banks form Wall Street, ETFs, etc.
            </p>

            <p className="block-p">
              In post-modern world
              <Hl text="True anarchism is" color="#55FFFF"/>
              <Hl text="in burning BTC… And mining the most valuable asset — " color="#fff"/>
              <Hl text="freedom." color="#55FFFF"/>
            </p>
          </div>
        </BlockWithTitle>
      </div>
    </>
  );
}
