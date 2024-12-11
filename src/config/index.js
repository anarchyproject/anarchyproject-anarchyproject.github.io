import {http, createConfig} from 'wagmi'
import {sepolia} from 'wagmi/chains'
import {injected, walletConnect} from 'wagmi/connectors';

const infuraProjectId = '497209c9d83b456791084efe5109de70';

export const config = createConfig({
  chains: [
    {
      ...sepolia,
      rpcUrls: {
        default: {
          http: [`https://sepolia.infura.io/v3/${infuraProjectId}`],
        },
      },
    },
  ],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
    }),
  ],
  transports: {
    [sepolia.id]: http(`https://sepolia.infura.io/v3/${infuraProjectId}`),
  },
});