"use client"

import { usePropertyCount, useProperty } from "@/hooks/usePropertyManager"
import { useState, useEffect, useMemo } from "react"
import { Building } from "lucide-react"

export default function Occupancy() {
  const { data: propertyCount } = usePropertyCount()
  const [occupancyRate, setOccupancyRate] = useState("Loading...")
  const [isCalculating, setIsCalculating] = useState(true)

  // Generate property IDs
  const propertyIds = useMemo(() => {
    if (!propertyCount) return []
    return Array.from(
      { length: Number(propertyCount) },
      (_, i) => BigInt(i + 1)
    )
  }, [propertyCount])

  // Fetch all properties data using useProperty hook at the top level
  const propertiesData = propertyIds.map(id => {
    const { data } = useProperty(id)
    return data
  })

  useEffect(() => {
    if (!propertyCount || propertiesData.length === 0) {
      setOccupancyRate("0%")
      setIsCalculating(false)
      return
    }

    const validProperties = propertiesData.filter(Boolean)
    const rentedProperties = validProperties.filter(
      property => property && Number(property.status) === 1
    ).length

    const total = validProperties.length
    if (total === 0) {
      setOccupancyRate("0%")
    } else {
      const calculatedRate = (rentedProperties / total) * 100
      setOccupancyRate(`${calculatedRate.toFixed(1)}%`)
    }

    setIsCalculating(false)
  }, [propertyCount, propertiesData])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div>
        <div className="flex items-center mb-2">
          <Building className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Occupancy Rate</h3>
        </div>
        <div className="mt-1">
          <p className="text-2xl font-semibold text-gray-900">
            {isCalculating ? "Calculating..." : occupancyRate}
          </p>
          {!isCalculating && propertiesData.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                {propertiesData.filter(p => p && Number(p.status) === 1).length} out of {propertiesData.length} properties rented
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

