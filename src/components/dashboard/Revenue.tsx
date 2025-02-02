"use client"

import { usePropertyCount, useProperty } from "@/hooks/usePropertyManager"
import { useState, useEffect } from "react"

export default function Revenue() {
  const { data: propertyCount } = usePropertyCount()
  const [revenue, setRevenue] = useState<string>("Loading...")
  const [isCalculating, setIsCalculating] = useState(true)

  const properties = []
  if (propertyCount) {
    for (let i = 1; i <= Number(propertyCount); i++) {
      properties.push(useProperty(BigInt(i)))
    }
  }

  useEffect(() => {
    async function calculateRevenue() {
      if (!propertyCount) {
        setRevenue("0 ETH")
        setIsCalculating(false)
        return
      }

      let totalRevenue = BigInt(0)

      for (let i = 0; i < properties.length; i++) {
        const { data: property } = properties[i]
        if (property && property.status === 1) {
          // Rented
          totalRevenue += property.rentAmount
        }
      }

      // Convert wei to ETH for display
      const ethValue = Number(totalRevenue) / 1e18
      setRevenue(`${ethValue.toFixed(4)} ETH`)
      setIsCalculating(false)
    }

    calculateRevenue()
  }, [propertyCount, properties])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Monthly Revenue</h3>
        <div className="mt-1">
          <p className="text-2xl font-semibold text-gray-900">{isCalculating ? "Calculating..." : revenue}</p>
        </div>
      </div>
    </div>
  )
}

