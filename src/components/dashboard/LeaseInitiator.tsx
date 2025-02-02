"use client"

import { useState } from "react"
import { useContractWrite, useAccount } from "wagmi"
import { PropertyManagerABI } from "@/contracts/abis/PropertyManager"
import { PROPERTY_MANAGER_ADDRESS } from "@/constants/contracts"

export default function LeaseInitiator({ propertyId, onLeaseInitiated }) {
  const [tenantAddress, setTenantAddress] = useState("")
  const [duration, setDuration] = useState("12") // Default 12 months
  const [isLoading, setIsLoading] = useState(false)
  const { isConnected } = useAccount()

  const { writeAsync: initiateLease } = useContractWrite({
    address: PROPERTY_MANAGER_ADDRESS,
    abi: PropertyManagerABI,
    functionName: "inititateLease",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isConnected) {
      alert("Please connect your wallet first")
      return
    }

    setIsLoading(true)
    try {
      // Convert months to seconds for the contract
      const durationInSeconds = BigInt(parseInt(duration) * 30 * 24 * 60 * 60)
      
      const tx = await initiateLease({
        args: [BigInt(propertyId), tenantAddress, durationInSeconds],
      })

      console.log("Lease initiated:", tx)
      if (onLeaseInitiated) onLeaseInitiated()
      alert("Lease initiated successfully!")
    } catch (err) {
      console.error("Error initiating lease:", err)
      alert("Failed to initiate lease. See console for details.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-4 p-4 border rounded-lg">
      <h4 className="text-sm font-medium mb-3">Initiate Lease</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-700">Tenant Address</label>
          <input
            type="text"
            value={tenantAddress}
            onChange={(e) => setTenantAddress(e.target.value)}
            placeholder="0x..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-700">Duration (months)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="1"
            max="60"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !isConnected}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? "Initiating..." : "Initiate Lease"}
        </button>
      </form>
    </div>
  )
}

