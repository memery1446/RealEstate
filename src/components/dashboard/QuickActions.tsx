"use client"

import { useState, useEffect } from "react"
import { useAddProperty, useTestConnection } from "@/hooks/usePropertyManager"

export default function QuickActions() {
  const [showForm, setShowForm] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "unknown">("unknown")

  const { addProperty, isLoading, isSuccess, isPrepared, prepareError, setRentAmount, setSecurityDeposit } =
    useAddProperty()
  const { data: isConnected, isError: isConnectionError } = useTestConnection()

  useEffect(() => {
    if (isConnected === true) {
      setConnectionStatus("connected")
    } else if (isConnectionError) {
      setConnectionStatus("disconnected")
    } else {
      setConnectionStatus("unknown")
    }
  }, [isConnected, isConnectionError])

  useEffect(() => {
    console.log("isPrepared:", isPrepared)
    console.log("prepareError:", prepareError)
  }, [isPrepared, prepareError])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const rentAmount = formData.get("rentAmount") as string
    const securityDeposit = formData.get("securityDeposit") as string

    console.log("Submitting:", { rentAmount, securityDeposit })

    const success = await addProperty(rentAmount, securityDeposit)
    if (success) {
      setShowForm(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "rentAmount") {
      setRentAmount(value)
    } else if (name === "securityDeposit") {
      setSecurityDeposit(value)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>

      <div className="mb-4">
        Connection Status:
        {connectionStatus === "connected" && <span className="text-green-500 ml-2">Connected</span>}
        {connectionStatus === "disconnected" && <span className="text-red-500 ml-2">Disconnected</span>}
        {connectionStatus === "unknown" && <span className="text-yellow-500 ml-2">Unknown</span>}
      </div>

      <div className="mb-4">
        Preparation Status: {isPrepared ? "Prepared" : "Not Prepared"}
        {prepareError && <p className="text-red-500">Prepare Error: {prepareError.message}</p>}
      </div>

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
                name="rentAmount"
                onChange={handleInputChange}
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
                name="securityDeposit"
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="0.2"
                required
              />
            </label>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading || connectionStatus !== "connected" || !isPrepared}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {isLoading ? "Adding..." : isPrepared ? "Add Property" : "Preparing..."}
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
      {isSuccess && <p className="text-green-500 mt-2">Property added successfully!</p>}
    </div>
  )
}

