"use client"

import { useState } from "react"
import { useAddProperty, usePropertyCount } from "@/hooks/usePropertyManager"
import { useConnect, useContractWrite, useAccount } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { PROPERTY_MANAGER_ADDRESS } from "@/constants/contracts"
import { PropertyManagerABI } from "@/contracts/abis/PropertyManager"

export default function QuickActions() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [showRentForm, setShowRentForm] = useState(false)
  const [rent, setRent] = useState("")
  const [deposit, setDeposit] = useState("")
  const [selectedProperty, setSelectedProperty] = useState("")
  const [tenantAddress, setTenantAddress] = useState("")
  const [isLeaseLoading, setIsLeaseLoading] = useState(false)
  const { data: propertyCount } = usePropertyCount()
  const { addProperty, isLoading, error, isConnected } = useAddProperty()
  const { address } = useAccount()

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })

  const { writeAsync: initiateLease } = useContractWrite({
    address: PROPERTY_MANAGER_ADDRESS,
    abi: PropertyManagerABI,
    functionName: "inititateLease",
  })

  const propertyIds = Array.from(
    { length: Number(propertyCount || 0) },
    (_, i) => i + 1
  )

  const handleAddProperty = async () => {
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
      setShowAddForm(false)
      setRent("")
      setDeposit("")
      alert("Property addition initiated. Please check your wallet for transaction confirmation.")
    } else {
      alert("Failed to initiate property addition. Please check the console for details.")
    }
  }

const handleRentProperty = async () => {
    if (!address) {
      try {
        await connect()
        return // Return here to let the connect action complete
      } catch (error) {
        console.error("Failed to connect wallet:", error)
        alert("Please connect your wallet first.")
        return
      }
    }

    if (!selectedProperty || !tenantAddress) {
      alert("Please select a property and enter tenant address.")
      return
    }

    setIsLeaseLoading(true)
    try {
      // 12 months in seconds
      const duration = BigInt(12 * 30 * 24 * 60 * 60)
      
      const tx = await initiateLease({
        args: [BigInt(selectedProperty), tenantAddress, duration],
      })

      console.log("Lease initiated:", tx)
      // Remove the tx.wait() line
      alert("Lease initiated successfully!")
      setShowRentForm(false)
      setSelectedProperty("")
      setTenantAddress("")
    } catch (err) {
      console.error("Error initiating lease:", err)
      alert("Failed to initiate lease. Please check the console for details.")
    } finally {
      setIsLeaseLoading(false)
    }
}

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
      
{!showAddForm && !showRentForm ? (
  <div className="space-x-4">
    <button
      onClick={() => setShowAddForm(true)}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Add Property
    </button>
    <button
      onClick={() => setShowRentForm(true)}
      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
    >
      Rent Property
    </button>
  </div>
      ) : showAddForm ? (
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
              onClick={handleAddProperty}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : address ? "Submit" : "Connect Wallet"}
            </button>
            <button 
              onClick={() => setShowAddForm(false)} 
              className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
          {error && <p className="text-red-500">{error.message}</p>}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Property</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
            >
              <option value="">Select a property</option>
              {propertyIds.map((id) => (
                <option key={id} value={id}>
                  Property #{id}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tenant Address</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="0x..."
              value={tenantAddress}
              onChange={(e) => setTenantAddress(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleRentProperty}
              className="bg-green-500 text-white font-bold py-2 px-4 rounded"
              disabled={isLeaseLoading}
            >
              {isLeaseLoading ? "Submitting..." : address ? "Initiate Lease" : "Connect Wallet"}
            </button>
            <button 
              onClick={() => setShowRentForm(false)} 
              className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

