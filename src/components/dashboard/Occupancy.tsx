"use client"

import { usePropertyCount, useProperty } from "@/hooks/usePropertyManager"
import { useState, useEffect } from "react"

export default function Occupancy() {
  const { data: propertyCount } = usePropertyCount()
  const [rate, setRate] = useState<string>("Loading...")
  const [isCalculating, setIsCalculating] = useState(true)
  const properties = []

  useEffect(() => {
    async function calculateOccupancy() {
      if (!propertyCount) {
        setRate("0.0%")
        setIsCalculating(false)
        return
      }

      let rentedCount = 0
      const count = Number(propertyCount)

      // Only proceed with calculation if there are properties
      if (count > 0) {
        for (let i = 1; i <= count; i++) {
          const { data: property } = useProperty(BigInt(i))
          properties.push(property)
          if (property && property.status === 1) {
            // 1 = PropertyStatus.Rented
            rentedCount++
          }
        }
        const occupancyRate = (rentedCount / count) * 100
        setRate(`${occupancyRate.toFixed(1)}%`)
      } else {
        setRate("0.0%")
      }

      setIsCalculating(false)
    }

    calculateOccupancy()
  }, [propertyCount])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Occupancy Rate</h3>
        <div className="mt-1">
          <p className="text-2xl font-semibold text-gray-900">{isCalculating ? "Calculating..." : rate}</p>
        </div>
      </div>
    </div>
  )
}

