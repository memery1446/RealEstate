"use client"

import { useState } from "react"
import { useAddProperty, usePropertyCount, useProperty } from "@/hooks/usePropertyManager"
import { useConnect, useContractWrite, useAccount } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { PROPERTY_MANAGER_ADDRESS } from "@/constants/contracts"
import { PropertyManagerABI } from "@/contracts/abis/PropertyManager"

export default function QuickActions() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [showRentForm, setShowRentForm] = useState(false)
  const [showManageForm, setShowManageForm] = useState(false)
  const [rent, setRent] = useState("")
  const [deposit, setDeposit] = useState("")
  const [selectedProperty, setSelectedProperty] = useState("")
  const [tenantAddress, setTenantAddress] = useState("")
  const [isLeaseLoading, setIsLeaseLoading] = useState(false)
  const { data: propertyCount } = usePropertyCount()
 const { data: selectedPropertyData, isLoading: isPropertyDataLoading } = useProperty(
  selectedProperty ? BigInt(selectedProperty) : undefined,
  {
    enabled: Boolean(selectedProperty)
  }
)
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

  const { writeAsync: endLease } = useContractWrite({
    address: PROPERTY_MANAGER_ADDRESS,
    abi: PropertyManagerABI,
    functionName: "endLease",
  })

  const { writeAsync: setMaintenance } = useContractWrite({
    address: PROPERTY_MANAGER_ADDRESS,
    abi: PropertyManagerABI,
    functionName: "setMaintenanceStatus",
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
      alert("Property added successfully!")
    }
  }

  const handleRentProperty = async () => {
    if (!address) {
      try {
        await connect()
        return
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
      const duration = BigInt(12 * 30 * 24 * 60 * 60)
      
      const tx = await initiateLease({
        args: [BigInt(selectedProperty), tenantAddress, duration],
      })

      console.log("Lease initiated:", tx)
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

  const handleEndLease = async () => {
    if (!selectedProperty) return
    
    try {
      const tx = await endLease({
        args: [BigInt(selectedProperty)],
      })
      alert("Lease ended successfully!")
      setShowManageForm(false)
      setSelectedProperty("")
    } catch (err) {
      console.error("Error ending lease:", err)
      alert("Failed to end lease. Check console for details.")
    }
  }

  const handleSetMaintenance = async () => {
    if (!selectedProperty) return
    
    try {
      const tx = await setMaintenance({
        args: [BigInt(selectedProperty), true],
      })
      alert("Property set to maintenance mode!")
      setShowManageForm(false)
      setSelectedProperty("")
    } catch (err) {
      console.error("Error setting maintenance:", err)
      alert("Failed to set maintenance status. Check console for details.")
    }
  }

  const getStatusText = (status) => {
    if (!status && status !== 0) return "Unknown"
    switch(Number(status)) {
      case 0: return "Available"
      case 1: return "Rented"
      case 2: return "Under Maintenance"
      default: return "Unknown"
    }
  }

  const renderActionButtons = () => (
    <div className="space-x-4">
      <button
        onClick={() => {
          setShowAddForm(true)
          setShowRentForm(false)
          setShowManageForm(false)
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Property
      </button>
      <button
        onClick={() => {
          setShowRentForm(true)
          setShowAddForm(false)
          setShowManageForm(false)
        }}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Rent Property
      </button>
      <button
        onClick={() => {
          setShowManageForm(true)
          setShowAddForm(false)
          setShowRentForm(false)
        }}
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
      >
        Manage Property
      </button>
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
      
      {!showAddForm && !showRentForm && !showManageForm ? (
        renderActionButtons()
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
      ) : showRentForm ? (
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
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Property to Manage</label>
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

{selectedProperty && (
  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
    <h4 className="font-medium mb-2">Property Details</h4>
    {isPropertyDataLoading ? (
      <p>Loading property details...</p>
    ) : selectedPropertyData ? (
      <div className="space-y-2 text-sm">
        <p>Status: {getStatusText(selectedPropertyData.status)}</p>
        <p>Current Tenant: {selectedPropertyData.currentTenant}</p>
        <p>Rent Amount: {Number(selectedPropertyData.rentAmount) / 1e18} ETH</p>
        
        <div className="pt-4 space-x-4">
          {selectedPropertyData.status === 1 && (
            <button
              onClick={handleEndLease}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              End Lease
            </button>
          )}
          {selectedPropertyData.status !== 2 && (
            <button
              onClick={handleSetMaintenance}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Set Maintenance
            </button>
          )}
        </div>
      </div>
    ) : (
      <p>No property data available</p>
    )}
  </div>
)}

          <div className="flex space-x-4">
            <button 
              onClick={() => setShowManageForm(false)} 
              className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

