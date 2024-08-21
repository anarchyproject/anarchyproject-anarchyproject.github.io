"use client";
import "./globals.css";
import {Header} from "~/components/header";
import localFont from "next/font/local";
import {Footer} from "~/components/footer";
import {DynamicText} from "~/components/dynamic-text";
import { WagmiProvider } from 'wagmi';
import { config } from '../config';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { GoogleTagManager } from '@next/third-parties/google'

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

  return (
    <html className={`${sansFont.variable} ${sansFontWeb.variable} ${biosFont.variable} ${biosFontWeb.variable} font-sans`}>
    <body>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="flex w-full flex-col justify-center gap-8">
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
    <GoogleTagManager gtmId="G-57D0MRREGC" />
    </html>
  );
}
