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

// src/hooks/usePropertyManager.ts
export function useAddProperty(rentAmount?: string, securityDeposit?: string) {
  const rentInWei = rentAmount ? parseEther(rentAmount) : undefined
  const depositInWei = securityDeposit ? parseEther(securityDeposit) : undefined

  console.log('Preparing values:', {
    rentInWei: rentInWei?.toString(),
    depositInWei: depositInWei?.toString()
  })

  const { config, error: prepareError } = usePrepareContractWrite({
    address: PROPERTY_MANAGER_ADDRESS,
    abi: PropertyManagerABI,
    functionName: 'addProperty',
    args: rentInWei && depositInWei ? [rentInWei, depositInWei] : undefined,
    enabled: Boolean(rentInWei && depositInWei),
    // Add these options
    account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    chainId: 1337,
    value: 0n
  })

  if (prepareError) {
    console.log('Prepare error:', prepareError)
  }

  const { writeAsync, error: writeError } = useContractWrite(config)

  if (writeError) {
    console.log('Write error:', writeError)
  }

  return {
    writeAsync,
    prepareError,
    writeError
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


