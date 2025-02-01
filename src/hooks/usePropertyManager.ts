// src/hooks/usePropertyManager.ts
'use client'

import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { PropertyManagerABI } from '@/contracts/abis/PropertyManager'
import { PROPERTY_MANAGER_ADDRESS } from '@/constants/contracts'
import { parseEther } from 'viem'
import { useState, useEffect } from "react"

// Read hooks
export function usePropertyCount() {
  return useContractRead({
    address: PROPERTY_MANAGER_ADDRESS,
    abi: PropertyManagerABI,
    functionName: 'propertyCount',
    watch: true
  })
}

export function useProperty(propertyId: bigint) {
  return useContractRead({
    address: PROPERTY_MANAGER_ADDRESS,
    abi: PropertyManagerABI,
    functionName: 'properties',
    args: [propertyId],
    watch: true
  })
}

export function useAddProperty() {
  const [rentAmount, setRentAmount] = useState<string>("")
  const [securityDeposit, setSecurityDeposit] = useState<string>("")
  const [isPrepared, setIsPrepared] = useState(false)

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
    isSuccess: isPrepareSuccess,
  } = usePrepareContractWrite({
    address: PROPERTY_MANAGER_ADDRESS,
    abi: PropertyManagerABI,
    functionName: "addProperty",
    args: rentAmount && securityDeposit ? [parseEther(rentAmount), parseEther(securityDeposit)] : undefined,
    enabled: Boolean(rentAmount && securityDeposit),
  })

  const { writeAsync, isLoading, isSuccess, error: writeError } = useContractWrite(config)

  useEffect(() => {
    console.log("Prepare state:", { isPrepareSuccess, isPrepareError, prepareError })
    if (isPrepareSuccess) {
      setIsPrepared(true)
    } else {
      setIsPrepared(false)
    }
  }, [isPrepareSuccess, isPrepareError, prepareError])

  const addProperty = async (rent: string, deposit: string) => {
    try {
      console.log("Contract Address:", PROPERTY_MANAGER_ADDRESS)
      console.log("Setting values:", { rent, deposit })

      setRentAmount(rent)
      setSecurityDeposit(deposit)

      // Wait for the prepare to complete
      let attempts = 0
      while (!isPrepared && attempts < 10) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        attempts++
        console.log(`Waiting for preparation... Attempt ${attempts}`)
      }

      if (!writeAsync) {
        console.error("Write not ready", { prepareError, isPrepareError, isPrepareSuccess })
        return false
      }

      const rentInWei = parseEther(rent)
      const depositInWei = parseEther(deposit)

      console.log("Sending values:", {
        rentAmount: rent,
        securityDeposit: deposit,
        rentInWei: rentInWei.toString(),
        depositInWei: depositInWei.toString(),
      })

      const tx = await writeAsync()
      console.log("Transaction submitted:", tx)

      return true
    } catch (error) {
      console.error("Error details:", error)
      return false
    }
  }

  return {
    addProperty,
    isLoading,
    isSuccess,
    error: writeError,
    isPrepared,
    prepareError,
    setRentAmount,
    setSecurityDeposit,
  }
}



// Add this new hook to test the connection
export function useTestConnection() {
  return useContractRead({
    address: PROPERTY_MANAGER_ADDRESS,
    abi: PropertyManagerABI,
    functionName: "testConnection",
  })
}

// export function useInitiateLease() {
//   const { config } = usePrepareContractWrite({
//     address: PROPERTY_MANAGER_ADDRESS,
//     abi: PropertyManagerABI,
//     functionName: 'inititateLease',
//   })
//   return useContractWrite(config)
// }

// export function usePayRent() {
//   const { config } = usePrepareContractWrite({
//     address: PROPERTY_MANAGER_ADDRESS,
//     abi: PropertyManagerABI,
//     functionName: 'payRent',
//   })
//   return useContractWrite(config)
// }

