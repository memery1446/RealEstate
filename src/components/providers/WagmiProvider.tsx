// src/app/components/provider/WagmiProvider.tsx
'use client'

import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { Chain } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

const hardhat: Chain = {
  id: 1337,  // Matches your MetaMask
  name: 'Hardhat',
  network: 'hardhat',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545']
    },
    public: {
      http: ['http://127.0.0.1:8545']
    }
  }
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [hardhat],
  [publicProvider()]
)

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient
})

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>
}

