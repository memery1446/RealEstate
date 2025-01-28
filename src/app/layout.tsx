import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import { WagmiConfig, createConfig } from 'wagmi'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { Toaster } from 'react-hot-toast'
import "./globals.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Real Estate Management",
  description: "Blockchain-based property management system",
};

const config = createConfig(
  getDefaultConfig({
    appName: 'Property Management DApp',
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  })
)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiConfig config={config}>
          <ConnectKitProvider>
            {children}
            <Toaster position="top-right" />
          </ConnectKitProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}

