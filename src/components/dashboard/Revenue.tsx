"use client"

import { usePropertyCount } from "@/hooks/usePropertyManager"
import { useState, useEffect, useMemo } from "react"
import { ethers, Contract } from "ethers";



import { PropertyManagerABI } from "@/contracts/abis/PropertyManager";



export default function Revenue() {
  const { data: propertyCount } = usePropertyCount()
  const [revenue, setRevenue] = useState<string>("Loading...")
  const [isCalculating, setIsCalculating] = useState(true)
  const [properties, setProperties] = useState([])

  // Your deployed contract address (Replace this with your actual contract address)
  const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

  // Generate property IDs safely
  const propertyIds = useMemo(() => {
    if (!propertyCount) return []
    return Array.from({ length: Number(propertyCount) }, (_, i) => BigInt(i + 1))
  }, [propertyCount])

  // 🔥 Fetch property data directly from the blockchain
async function fetchPropertyData(id) {
  try {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545"); // Hardhat local node
    const contract = new Contract(CONTRACT_ADDRESS, PropertyManagerABI, provider);

    // ✅ Correct function call based on ABI
    const data = await contract.properties(id);

    return {
      id,
      status: Number(data.status), 
      rentAmount: data.rentAmount.toString(),
    };
  } catch (error) {
    console.error(`Error fetching property ${id}:`, error);
    return null;
  }
}

  // ✅ Fetch property data inside useEffect
  useEffect(() => {
    async function fetchProperties() {
      if (!propertyCount) return

      const fetchedProperties = await Promise.all(
        propertyIds.map(async (id) => fetchPropertyData(id))
      )

      setProperties(fetchedProperties.filter(Boolean)) // Remove null values
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

      // Convert wei to ETH
      const ethValue = Number(totalRevenue) / 1e18
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
