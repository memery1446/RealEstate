'use client'

import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { Chain } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

const hardhat: Chain = {
  id: 31337,
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

const { chains, publicClient } = configureChains(
  [hardhat],
  [publicProvider()]
)

const config = createConfig({
  autoConnect: true,
  publicClient
})

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>
}

