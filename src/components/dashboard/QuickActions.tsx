'use client'

import { useState } from 'react'
import { useAddProperty } from '@/hooks/usePropertyManager'
import { formatEther, parseEther } from 'viem'

export default function QuickActions() {
  const [showForm, setShowForm] = useState(false)
  const [rentAmount, setRentAmount] = useState('')
  const [securityDeposit, setSecurityDeposit] = useState('')
  
  const { addProperty, isLoading } = useAddProperty(rentAmount, securityDeposit)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (!addProperty) {
        console.error('Write function not ready')
        return
      }

      // Log the exact values being sent
      const rentInWei = parseEther(rentAmount)
      const depositInWei = parseEther(securityDeposit)
      
      console.log('Sending values:', {
        rentAmount,
        securityDeposit,
        rentInWei: formatEther(rentInWei),
        depositInWei: formatEther(depositInWei)
      })

      const tx = await addProperty()
      console.log('Transaction:', tx)
      
      setShowForm(false)
      setRentAmount('')
      setSecurityDeposit('')
    } catch (error) {
      console.error('Error:', error)
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
                onChange={(e) => {
                  // Only allow numbers and decimals
                  const val = e.target.value.replace(/[^0-9.]/g, '')
                  if (val === '' || /^\d*\.?\d*$/.test(val)) {
                    setRentAmount(val)
                  }
                }}
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
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9.]/g, '')
                  if (val === '' || /^\d*\.?\d*$/.test(val)) {
                    setSecurityDeposit(val)
                  }
                }}
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
              {isLoading ? 'Adding...' : 'Add Property'}
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
    </div>
  )
}

