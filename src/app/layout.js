"use client";
import "./globals.css";
import {Header} from "~/components/header";
import localFont from "next/font/local";
import {Footer} from "~/components/footer";
import {DynamicText} from "~/components/dynamic-text";
import { WagmiProvider } from 'wagmi';
import { config } from '~/config';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { sendGTMEvent } from '@next/third-parties/google'
import Image from "next/image";
import {useEffect} from "react";
import {GTM} from "~/components/gtm";

const biosFont = localFont({
  src: '/fonts/Ac437_DTK_BIOS.ttf',
  variable: "--font-bios",
  }
);

const biosFontWeb = localFont({
  src: '/fonts/Web437_DTK_BIOS.woff',
  variable: "--font-bios-web",
  }
);

const sansFont = localFont({
  src: '/fonts/Ac437_EpsonMGA_Alt.ttf',
  variable: "--font-sans",
  }
);

const sansFontWeb = localFont({
  src: '/fonts/Web437_EpsonMGA_Alt.woff',
  variable: "--font-sans-web",
  }
);

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  useEffect(() => {
    sendGTMEvent({ event: 'js', value: new Date() });
  }, []);

  return (
    <html className={`${sansFont.variable} ${sansFontWeb.variable} ${biosFont.variable} ${biosFontWeb.variable} font-sans`}>
    <GTM />
    <body>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="flex w-full flex-col justify-center">
          <Header/>
          {children}
          <div className="px-5 md:px-10 lg:px-20 xl:gap-20 xl:px-[120px]">
            <DynamicText text="Join the freedom movement. MINT Anarchy Coin. Burn Bitcoin."/>
            <Footer/>
          </div>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
    </body>
    </html>
  );
}
