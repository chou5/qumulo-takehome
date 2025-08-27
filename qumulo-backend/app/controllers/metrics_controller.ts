// app/controllers/metrics_controller.ts
import type { HttpContext } from '@adonisjs/core/http'

function seededRandom(seed: number) {
  return () => {
    seed ^= seed << 13; seed ^= seed >> 17; seed ^= seed << 5
    return ((seed >>> 0) % 10000) / 10000
  }
}

export default class MetricsController {
  public async index({ params, request, response }: HttpContext) {
    const id = String(params.id)
    const from = Number(request.input('from'))
    const to = Number(request.input('to'))
    const step = Math.max(1, Number(request.input('step') ?? 60))

    if (!from || !to || to <= from) {
      return response.badRequest({ error: 'Invalid query: need from < to (unix seconds)' })
    }

    const seed =
      id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) + from + to + step
    const rnd = seededRandom(seed)

    const iops: { ts: number; value: number }[] = []
    const throughputMBps: { ts: number; value: number }[] = []

    for (let t = from; t <= to; t += step) {
      const baseIOPS = 1000 + (id.length % 7) * 80
      const waveIOPS = Math.sin(t / 180) * 150
      const noiseIOPS = rnd() * 60
      const burstIOPS = rnd() > 0.992 ? rnd() * 4000 : 0
      iops.push({ ts: t * 1000, value: Math.round(baseIOPS + waveIOPS + noiseIOPS + burstIOPS) })

      const baseMB = 8 + (id.length % 5) * 0.3
      const waveMB = Math.sin(t / 300) * 0.7
      const noiseMB = rnd() * 0.3
      const spikeMB = rnd() > 0.995 ? rnd() * 25 : 0
      throughputMBps.push({ ts: t * 1000, value: Math.round((baseMB + waveMB + noiseMB + spikeMB) * 10) / 10 })
    }

    return { clusterId: id, from, to, step, iops, throughputMBps }
  }
}
