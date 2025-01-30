// src/components/dashboard/QuickActions.tsx
'use client'

import { useState } from 'react'

export default function QuickActions() {
  const [showForm, setShowForm] = useState(false)
  const [rentAmount, setRentAmount] = useState('')
  const [securityDeposit, setSecurityDeposit] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting:', { rentAmount, securityDeposit })
    // Will add contract interaction here
    setShowForm(false)
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
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Property
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

