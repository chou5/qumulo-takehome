// lib/types.ts
export type Cluster = {
  id: string
  name: string
  region: string
}

export type MetricPoint = {
  ts: number
  value: number
}

export type MetricsResponse = {
  clusterId: string
  from?: number
  to?: number
  step: number
  iops: MetricPoint[]
  throughputMBps: MetricPoint[]
}

export type SnapshotPolicy = {
  enabled: boolean
  schedule: { cron: string }
  retentionDays: number
  locking: { enabled: boolean; lockUntil?: string }
}
