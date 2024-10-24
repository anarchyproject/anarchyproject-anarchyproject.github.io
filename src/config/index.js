import { http, createConfig } from 'wagmi'
import {holesky, sepolia} from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors';

export const config = createConfig({
  chains: [holesky],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
    })
  ],
  transports: {
    [holesky.id]: http(),
  },
});
