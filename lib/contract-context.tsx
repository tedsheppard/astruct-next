'use client'

import { createContext, useContext } from 'react'

interface ContractContextValue {
  selectedContractId: string
  setSelectedContractId: (id: string) => void
  selectContractAndNavigate: (id: string, path?: string) => void
}

export const ContractContext = createContext<ContractContextValue>({
  selectedContractId: '',
  setSelectedContractId: () => {},
  selectContractAndNavigate: () => {},
})

export function useContract() {
  return useContext(ContractContext)
}
