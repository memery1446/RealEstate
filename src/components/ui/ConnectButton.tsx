"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { useState, useEffect } from "react"

export function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (isConnected)
    return (
      <div>
        <button
          onClick={() => disconnect()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Disconnect {address?.slice(0, 6)}...{address?.slice(-4)}
        </button>
      </div>
    )

  return (
    <button onClick={() => connect()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Connect Wallet
    </button>
  )
}

