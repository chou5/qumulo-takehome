'use client'

import { useEffect, useState } from 'react'
import { listClusters } from '@/lib/api'
import type { Cluster } from '@/lib/types'

export default function ClusterSelect({
  value,
  onChange,
}: {
  value?: string
  onChange: (id: string) => void
}) {
  const [clusters, setClusters] = useState<Cluster[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listClusters()
      .then((cs) => {
        setClusters(cs)
        // Auto-select first cluster if none selected yet
        if (!value && cs.length) onChange(cs[0].id)
      })
      .finally(() => setLoading(false))
  }, []) // intentionally run once

  if (loading) return <div className="text-sm text-gray-400">Loading clusters…</div>
  if (!clusters.length) return <div className="text-sm text-red-500">No clusters found</div>

  return (
    <select
      className="bg-[#0b1220] border border-[#1e293b] text-[#cbd5e1] rounded-lg px-3 py-2 text-sm"
      value={value ?? (clusters[0]?.id ?? '')}
      onChange={(e) => onChange(e.target.value)}
    >
      {clusters.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name} • {c.region}
        </option>
      ))}
    </select>
  )
}
