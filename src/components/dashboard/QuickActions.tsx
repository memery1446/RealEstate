"use client"

import { useState, useEffect } from "react"
import { useAddProperty, useTestConnection } from "@/hooks/usePropertyManager"

export default function QuickActions() {
  const [showForm, setShowForm] = useState(false)
  const [rentAmount, setRentAmount] = useState("")
  const [securityDeposit, setSecurityDeposit] = useState("")

  const { addProperty, isLoading, isSuccess, error } = useAddProperty()
  const { data: isConnected, isError: isConnectionError } = useTestConnection()

  useEffect(() => {
    console.log("Connection test result:", isConnected)
    if (isConnectionError) {
      console.error("Error connecting to the contract")
    }
  }, [isConnected, isConnectionError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting:", { rentAmount, securityDeposit })

    const success = await addProperty(rentAmount, securityDeposit)
    if (success) {
      setShowForm(false)
      setRentAmount("")
      setSecurityDeposit("")
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Monthly Rent (ETH)
              <input
                type="text"
                value={rentAmount}
                onChange={(e) => setRentAmount(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="0.1"
                required
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Security Deposit (ETH)
              <input
                type="text"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="0.2"
                required
              />
            </label>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {isLoading ? "Adding..." : "Add Property"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
      {isSuccess && <p className="text-green-500 mt-2">Property added successfully!</p>}
    </div>
  )
}

