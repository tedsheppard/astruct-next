'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function ContractDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  useEffect(() => {
    router.replace(`/contracts/${id}/assistant`)
  }, [id, router])

  return null
}
