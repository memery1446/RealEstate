"use client"

import { usePropertyCount } from "@/hooks/usePropertyManager"
import { useState, useEffect, useMemo } from "react"
import { ethers, Contract } from "ethers"
import { PropertyManagerABI } from "@/contracts/abis/PropertyManager"

export default function Revenue() {
  const { data: propertyCount } = usePropertyCount()
  const [revenue, setRevenue] = useState("Loading...")
  const [isCalculating, setIsCalculating] = useState(true)
  const [properties, setProperties] = useState([])

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
      
      // Log the raw data and parsed values
      console.log(`Revenue Property ${id} Data:`, {
        raw: data,
        status: Number(data.status),
        rentAmount: ethers.formatEther(data.rentAmount),
        owner: data.owner,
        tenant: data.currentTenant
      })

      return {
        id,
        status: Number(data.status),
        rentAmount: data.rentAmount.toString(),
      }
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error)
      return null
    }
  }

  useEffect(() => {
    async function fetchProperties() {
      if (!propertyCount) return
      console.log("Revenue Property Count:", propertyCount)

      const fetchedProperties = await Promise.all(
        propertyIds.map(async (id) => fetchPropertyData(id))
      )

      const validProperties = fetchedProperties.filter(Boolean)
      console.log("All Revenue Properties:", validProperties)
      setProperties(validProperties)
    }

    fetchProperties()
  }, [propertyIds])

  useEffect(() => {
    async function calculateRevenue() {
      if (!propertyCount || properties.length === 0) {
        setRevenue("0 ETH")
        setIsCalculating(false)
        return
      }

      let totalRevenue = BigInt(0)

      for (const property of properties) {
        if (property && property.status === 1) {
          totalRevenue += BigInt(property.rentAmount)
        }
      }

      // Convert wei to ETH and log the calculation
      const ethValue = Number(totalRevenue) / 1e18
      console.log("Revenue Calculation:", {
        totalRevenueWei: totalRevenue.toString(),
        ethValue,
        propertiesIncluded: properties.filter(p => p?.status === 1).length
      })

      setRevenue(`${ethValue.toFixed(4)} ETH`)
      setIsCalculating(false)
    }

    calculateRevenue()
  }, [properties])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Monthly Revenue</h3>
        <div className="mt-1">
          <p className="text-2xl font-semibold text-gray-900">
            {isCalculating ? "Calculating..." : revenue}
          </p>
        </div>
      </div>
    </div>
  )
}

