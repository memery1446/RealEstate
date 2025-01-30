'use client'

import { usePropertyCount } from '@/hooks/usePropertyManager'
import { useState, useEffect } from 'react'

export default function PropertyCount() {
  const { data: propertyCount, isLoading, isError } = usePropertyCount()
  const [count, setCount] = useState<string>("Loading...")

  useEffect(() => {
    if (isLoading) {
      setCount("Loading...")
    } else if (isError) {
      setCount("Error loading count")
    } else {
      setCount(propertyCount?.toString() || "0")
    }
  }, [propertyCount, isLoading, isError])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Total Properties</h3>
        <div className="mt-1">
          <p className="text-2xl font-semibold text-gray-900">
            {count}
          </p>
        </div>
      </div>
    </div>
  )
}

