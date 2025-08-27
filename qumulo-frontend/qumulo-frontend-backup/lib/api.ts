// lib/api.ts
import axios from 'axios'
import type { Cluster, MetricsResponse, SnapshotPolicy } from './types'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE, // e.g. http://localhost:55552/api
  timeout: 10000,
})

export const listClusters = async (): Promise<Cluster[]> => {
  const res = await api.get('/clusters')
  return res.data
}

export const getMetrics = async (
  id: string,
  q: { from?: number; to?: number; step?: number }
): Promise<MetricsResponse> => {
  const res = await api.get(`/clusters/${id}/metrics`, { params: q })
  return res.data
}

export const getPolicy = async (id: string): Promise<SnapshotPolicy> => {
  const res = await api.get(`/clusters/${id}/snapshot-policy`)
  return res.data
}

export async function putPolicy(clusterId: string, policy: any) {
  const res = await api.put(`/clusters/${clusterId}/snapshot-policy`, policy)
  return res.data  
}

