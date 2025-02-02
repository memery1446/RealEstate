"use client"

import { usePropertyCount, useProperty } from "@/hooks/usePropertyManager"
import { useState, useEffect, useMemo } from "react"
import { Building2, Wallet, Tool, User, Calendar } from "lucide-react"

export default function PropertyList() {
  const { data: propertyCount } = usePropertyCount()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const propertyIds = useMemo(() => {
    if (!propertyCount) return []
    return Array.from(
      { length: Number(propertyCount) },
      (_, i) => BigInt(i + 1)
    )
  }, [propertyCount])

  // Create property hooks at the component level
  const propertyDataArray = propertyIds.map(id => useProperty(id))

  // Process the data in a useMemo
  const propertiesData = useMemo(() => {
    return propertyDataArray
      .map(({ data }, index) => {
        if (!data) return null
        return {
          id: propertyIds[index], // Use the actual propertyId as the key
          status: Number(data.status) || 0,
          rentAmount: data.rentAmount?.toString() || '0',
          tenant: data.currentTenant || '',
          leaseStart: data.leaseStart?.toString() || '',
          leaseEnd: data.leaseEnd?.toString() || ''
        }
      })
      .filter(Boolean)
  }, [propertyDataArray, propertyIds])

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 0: return "bg-green-100 text-green-800"
      case 1: return "bg-blue-100 text-blue-800"
      case 2: return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status) => {
    switch(status) {
      case 0: return "Available"
      case 1: return "Rented"
      case 2: return "Maintenance"
      default: return "Unknown"
    }
  }

  if (!isClient) {
    return <div className="bg-white rounded-lg shadow-lg p-6">Loading...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Properties</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100">
            Filter
          </button>
          <button className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100">
            Sort
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {propertiesData.map((property) => (
          <div key={property.id.toString()} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-gray-500" />
                  <h3 className="text-lg font-medium">Property #{property.id.toString()}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(property.status)}`}>
                    {getStatusText(property.status)}
                  </span>
                </div>
                
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Wallet className="h-4 w-4" />
                    <span>{Number(property.rentAmount) / 1e18} ETH/month</span>
                  </div>
                  
                  {property.status === 1 && property.tenant && (
                    <>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>Tenant: {property.tenant.slice(0, 6)}...{property.tenant.slice(-4)}</span>
                      </div>
                      {property.leaseEnd && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Lease End: {new Date(Number(property.leaseEnd) * 1000).toLocaleDateString()}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                  View Details
                </button>
                {property.status === 1 && (
                  <button className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100">
                    End Lease
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

