"use client";

import { SwapWidget } from '@uniswap/widgets';
import '@uniswap/widgets/fonts.css';

const TOKEN_LIST = [
  {
    "name": "USD Coin",
    "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "symbol": "USDC",
    "decimals": 6,
    "chainId": 1,
    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
  },
  {
    "name": "Anarchy Coin",
    "address": "0xee8544eefe616ca232993fac9be2d0f7f8a00043",
    "symbol": "ANARCHY",
    "decimals": 18,
    "chainId": 1,
    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2f0b23f53734252bda2277357e97e1517d6b42be/logo.png"
  }
];

const rpcMap = {
  1: 'https://mainnet.chainnodes.org/695228ad-8b0d-465b-9375-cd3494db0b63',
}

export default function Swap() {
  if (typeof window !== "undefined") {
    // @ts-ignore
    window.Browser = {
      T: () => {
      }
    };
  }
  return (
    <div className="Uniswap">
      <SwapWidget
        jsonRpcUrlMap={rpcMap}
        tokenList={TOKEN_LIST}
        defaultInputTokenAddress="NATIVE"
        defaultInputAmount={1}
      />
    </div>
  );
}
