// src/components/dashboard/PropertyCount.tsx
'use client'

import { usePropertyCount } from '@/hooks/usePropertyManager'
import { Building2 } from 'lucide-react'

export default function PropertyCount() {
  const { data: propertyCount, isError, isLoading } = usePropertyCount()

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Total Properties</h3>
          <div className="mt-1">
            {isLoading ? (
              <p className="text-2xl font-semibold text-gray-600">Loading...</p>
            ) : isError ? (
              <p className="text-2xl font-semibold text-red-600">Error loading count</p>
            ) : (
              <p className="text-2xl font-semibold text-gray-900">
                {propertyCount?.toString() || '0'}
              </p>
            )}
          </div>
        </div>
        <div className="p-3 bg-blue-100 rounded-full">
          <Building2 className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </div>
  )
}

