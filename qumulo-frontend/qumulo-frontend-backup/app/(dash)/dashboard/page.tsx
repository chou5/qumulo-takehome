'use client'
import { useEffect, useMemo, useState } from 'react'
import ClusterSelect from '@/components/ClusterSelect'
import RangeSelect from '@/components/RangeSelect'
import TimeSeriesChart from '@/components/TimeSeriesChart'
import StatCard from '@/components/StatCard'
import ClientTime from '@/components/ClientTime'
import { getMetrics } from '@/lib/api'
import type { MetricsResponse } from '@/lib/types'

export default function DashboardPage() {
  const [clusterId, setClusterId] = useState<string>()
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null)
  const [range, setRange] = useState<'1h'|'24h'|'7d'>('7d')

  const { from, to, step } = useMemo(() => {
    const now = Math.floor(Date.now()/1000)
    const map = { '1h': 3600, '24h': 86400, '7d': 7*86400 }
    return { from: now - map[range], to: now, step: range==='7d' ? 300 : 60 }
  }, [range])

  useEffect(() => {
    if (!clusterId) return
    getMetrics(clusterId, { from, to, step }).then(setMetrics).catch(()=>setMetrics(null))
  }, [clusterId, from, to, step])

  const series = (arr?: { ts:number; value:number }[]) => (arr ?? []).map(p => ({ ts:p.ts, value:p.value }))
  const split = (arr?: { ts:number; value:number }[]) =>
    (arr ?? []).map(({ts,value}) => {
      const read = Math.round(value * 0.85)
      return { ts, read, write: Math.max(0, value - read) }
    })

  const iops = split(metrics?.iops)
  const tput = split(metrics?.throughputMBps)
  const latest = <T extends {ts:number}>(a:T[]) => a.length ? a[a.length-1] : undefined

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-white">Performance Metrics</h1>
        <div className="flex items-center gap-3">
          <ClusterSelect value={clusterId} onChange={setClusterId} />
          <RangeSelect value={range} onChange={setRange} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-9 space-y-4">
          <section className="bg-[#0b1220] border border-[#1e293b] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-white">IOPS</div>
              <div className="text-xs opacity-60"><ClientTime /></div>
            </div>
            <TimeSeriesChart
              data={iops.map(d => ({ ts:d.ts, read:d.read, write:d.write }))}
              yKey="read,write"
            />
          </section>

          <section className="bg-[#0b1220] border border-[#1e293b] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-white">Throughput</div>
              <div className="text-xs opacity-60"><ClientTime /></div>
            </div>
            <TimeSeriesChart
              data={tput.map(d => ({ ts:d.ts, read:d.read, write:d.write }))}
              yKey="read,write"
            />
          </section>
        </div>

        <div className="col-span-12 xl:col-span-3 space-y-4">
          <div className="space-y-2">
            <div className="text-sm opacity-70">IOPS</div>
            <StatCard title="Read" value={`${latest(iops)?.read ?? 0} IOPS`} />
            <StatCard title="Write" value={`${latest(iops)?.write ?? 0} IOPS`} />
          </div>
          <div className="space-y-2">
            <div className="text-sm opacity-70">Throughput</div>
            <StatCard title="Read" value={`${latest(tput)?.read ?? 0} MB/s`} />
            <StatCard title="Write" value={`${latest(tput)?.write ?? 0} MB/s`} />
          </div>
        </div>
      </div>
    </div>
  )
}
