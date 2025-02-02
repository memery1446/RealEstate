"use client"
import { usePropertyCount } from "@/hooks/usePropertyManager"
import { useState, useEffect } from "react"

export default function Occupancy() {
  const { data: propertyCount } = usePropertyCount()
  const [rate, setRate] = useState<string>("Loading...")

  useEffect(() => {
    if (!propertyCount) {
      setRate("0.0%")
      return
    }
    setRate(`${Number(propertyCount)} properties`)
  }, [propertyCount])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Properties</h3>
        <div className="mt-1">
          <p className="text-2xl font-semibold text-gray-900">{rate}</p>
        </div>
      </div>
    </div>
  )
}