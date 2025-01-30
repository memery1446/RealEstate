// src/hooks/usePropertyManager.ts
'use client'

import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { PropertyManagerABI } from '@/contracts/abis/PropertyManager'
import { PROPERTY_MANAGER_ADDRESS } from '@/constants/contracts'
import { parseEther } from 'viem'

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

export function useAddProperty(rentAmount?: string, securityDeposit?: string) {
  const { config } = usePrepareContractWrite({
    address: PROPERTY_MANAGER_ADDRESS,
    abi: PropertyManagerABI,
    functionName: 'addProperty',
    args: rentAmount && securityDeposit 
      ? [parseEther(rentAmount), parseEther(securityDeposit)]
      : undefined,
    enabled: Boolean(rentAmount && securityDeposit),
  })

  const { 
    writeAsync,
    isLoading,
    isSuccess,
  } = useContractWrite(config)

  return { 
    addProperty: writeAsync,
    isLoading,
    isSuccess,
  }
}

export function useInitiateLease() {
  const { config } = usePrepareContractWrite({
    address: PROPERTY_MANAGER_ADDRESS,
    abi: PropertyManagerABI,
    functionName: 'inititateLease',
  })
  return useContractWrite(config)
}

export function usePayRent() {
  const { config } = usePrepareContractWrite({
    address: PROPERTY_MANAGER_ADDRESS,
    abi: PropertyManagerABI,
    functionName: 'payRent',
  })
  return useContractWrite(config)
}


