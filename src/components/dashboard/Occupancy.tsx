"use client"

import { usePropertyCount } from "@/hooks/usePropertyManager"
import { useState, useEffect, useMemo } from "react"
import { ethers, Contract } from "ethers"
import { PropertyManagerABI } from "@/contracts/abis/PropertyManager"
import { Building } from "lucide-react"

export default function Occupancy() {
  const { data: propertyCount } = usePropertyCount()
  const [occupancyRate, setOccupancyRate] = useState("Loading...")
  const [properties, setProperties] = useState([])
  const [isCalculating, setIsCalculating] = useState(true)

  const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

  const propertyIds = useMemo(() => {
    if (!propertyCount) return []
    return Array.from({ length: Number(propertyCount) }, (_, i) => BigInt(i + 1))
  }, [propertyCount])

  async function fetchPropertyData(id) {
    try {
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545")
      const contract = new Contract(CONTRACT_ADDRESS, PropertyManagerABI, provider)
      const data = await contract.properties(id)
      
      console.log(`Property ${id} Data:`, {
        raw: data,
        status: Number(data.status),
        rentAmount: ethers.formatEther(data.rentAmount),
        deposit: ethers.formatEther(data.securityDeposit),
        owner: data.owner,
        tenant: data.currentTenant
      })

      return {
        id,
        status: Number(data.status),
        rentAmount: data.rentAmount.toString(),
        deposit: data.securityDeposit.toString()
      }
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error)
      return null
    }
  }

  useEffect(() => {
    async function fetchProperties() {
      if (!propertyCount) return
      console.log("Property Count:", propertyCount)

      const fetchedProperties = await Promise.all(
        propertyIds.map(async (id) => fetchPropertyData(id))
      )

      const validProperties = fetchedProperties.filter(Boolean)
      console.log("All Properties:", validProperties)
      setProperties(validProperties)
    }

    fetchProperties()
  }, [propertyIds])

  useEffect(() => {
    async function calculateOccupancy() {
      if (!propertyCount || properties.length === 0) {
        setOccupancyRate("0%")
        setIsCalculating(false)
        return
      }

      const rentedProperties = properties.filter(
        (property) => property && property.status === 1
      ).length

      const total = properties.length
      const rate = (rentedProperties / total) * 100

      console.log("Occupancy Calculation:", {
        total,
        rented: rentedProperties,
        rate: rate.toFixed(1)
      })

      setOccupancyRate(`${rate.toFixed(1)}%`)
      setIsCalculating(false)
    }

    calculateOccupancy()
  }, [properties])

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
          {!isCalculating && properties.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                {properties.filter(p => p?.status === 1).length} out of {properties.length} properties rented
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

