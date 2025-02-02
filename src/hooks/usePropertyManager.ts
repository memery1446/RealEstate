import { useContractRead, useContractWrite, useAccount } from "wagmi"
import { PropertyManagerABI } from "@/contracts/abis/PropertyManager"
import { PROPERTY_MANAGER_ADDRESS } from "@/constants/contracts"
import { parseEther } from "viem"
import { useState, useCallback } from "react"

export function usePropertyCount() {
  return useContractRead({
    address: PROPERTY_MANAGER_ADDRESS,
    abi: PropertyManagerABI,
    functionName: "propertyCount",
    watch: true,
  })
}

export function useProperty(propertyId?: bigint) {
  return useContractRead({
    address: PROPERTY_MANAGER_ADDRESS,
    abi: PropertyManagerABI,
    functionName: "properties",
    args: propertyId ? [propertyId] : undefined,
    enabled: !!propertyId,  // Only run the query if we have a propertyId
    watch: true,
  })
}

export function useAddProperty() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { isConnected } = useAccount()

  const { writeAsync } = useContractWrite({
    address: PROPERTY_MANAGER_ADDRESS,
    abi: PropertyManagerABI,
    functionName: "addProperty",
  })

  const addProperty = useCallback(
    async (rent: string, deposit: string) => {
      if (!isConnected) {
        setError(new Error("Wallet not connected"))
        return false
      }

      setIsLoading(true)
      setError(null)

      try {
        const rentInWei = parseEther(rent)
        const depositInWei = parseEther(deposit)

        console.log("Contract Address:", PROPERTY_MANAGER_ADDRESS)
        console.log("Sending values:", { rentInWei, depositInWei })

        const tx = await writeAsync({
          args: [rentInWei, depositInWei],
        })

        console.log("Transaction submitted:", tx)
        return true
      } catch (err) {
        console.error("Error details:", err)
        setError(err instanceof Error ? err : new Error("Unknown error occurred"))
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [writeAsync, isConnected],
  )

  return {
    addProperty,
    isLoading,
    error,
    isConnected,
  }
}

export function useInitiateLease() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { isConnected } = useAccount()

  const { writeAsync } = useContractWrite({
    address: PROPERTY_MANAGER_ADDRESS,
    abi: PropertyManagerABI,
    functionName: "inititateLease",
  })

  const initiateLease = useCallback(
    async (propertyId: string, tenantAddress: string, duration: string) => {
      if (!isConnected) {
        setError(new Error("Wallet not connected"))
        return false
      }

      setIsLoading(true)
      setError(null)

      try {
        const tx = await writeAsync({
          args: [BigInt(propertyId), tenantAddress, BigInt(duration)],
        })

        console.log("Lease initiated:", tx)
        return true
      } catch (err) {
        console.error("Error details:", err)
        setError(err instanceof Error ? err : new Error("Unknown error occurred"))
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [writeAsync, isConnected],
  )

  return {
    initiateLease,
    isLoading,
    error,
    isConnected,
  }
}

export function useTestConnection() {
  return useContractRead({
    address: PROPERTY_MANAGER_ADDRESS,
    abi: PropertyManagerABI,
    functionName: "testConnection",
  })
}

