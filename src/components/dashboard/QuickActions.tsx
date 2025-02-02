"use client"

import { useState } from "react"
import { useAddProperty } from "@/hooks/usePropertyManager"
import { useConnect } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"

export default function QuickActions() {
  const [showForm, setShowForm] = useState(false)
  const [rent, setRent] = useState("")
  const [deposit, setDeposit] = useState("")
  const { addProperty, isLoading, error, isConnected } = useAddProperty()

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })

  const handleSubmit = async () => {
    if (!isConnected) {
      try {
        await connect()
      } catch (error) {
        console.error("Failed to connect wallet:", error)
        alert("Please connect your wallet to add a property.")
        return
      }
    }

    if (!rent || !deposit) {
      alert("Please enter both rent and security deposit amounts.")
      return
    }

    const success = await addProperty(rent, deposit)
    if (success) {
      setShowForm(false)
      setRent("")
      setDeposit("")
      alert("Property addition initiated. Please check your wallet for transaction confirmation.")
    } else {
      alert("Failed to initiate property addition. Please check the console for more details.")
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Property
        </button>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Monthly Rent (ETH)</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="0.1"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Security Deposit (ETH)</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="0.2"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : isConnected ? "Submit" : "Connect Wallet"}
            </button>
            <button onClick={() => setShowForm(false)} className="bg-gray-500 text-white font-bold py-2 px-4 rounded">
              Cancel
            </button>
          </div>
          {error && <p className="text-red-500">{error.message}</p>}
        </div>
      )}
    </div>
  )
}

