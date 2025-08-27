import type { HttpContext } from '@adonisjs/core/http'
import fs from 'node:fs/promises'
import path from 'node:path'

const dataPath = (f: string) => path.join(process.cwd(), 'data', f)

type Policy = {
  enabled: boolean
  schedule: { cron: string }
  retentionDays: number
  locking: { enabled: boolean; lockUntil?: string }
}
type PolicyMap = Record<string, Policy>

export default class PoliciesController {
  private async read(): Promise<PolicyMap> {
    const raw = await fs.readFile(dataPath('policies.json'), 'utf-8').catch(() => '{}')
    return JSON.parse(raw)
  }
  private async write(map: PolicyMap) {
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true })
    await fs.writeFile(dataPath('policies.json'), JSON.stringify(map, null, 2))
  }

  public async show({ params, response }: HttpContext) {
    const id = String(params.id)
    const map = await this.read()
    const policy = map[id]
    if (!policy) return response.notFound({ error: 'No policy for cluster' })
    return policy
  }

  public async upsert({ params, request }: HttpContext) {
    const id = String(params.id)
    const body = request.body() as Policy
    const map = await this.read()
    map[id] = {
      enabled: !!body.enabled,
      schedule: { cron: body.schedule?.cron || '0 */6 * * *' },
      retentionDays: Number(body.retentionDays ?? 14),
      locking: { enabled: !!body.locking?.enabled, ...(body.locking?.lockUntil ? { lockUntil: body.locking.lockUntil } : {}) },
    }
    await this.write(map)
    return map[id]
  }
}
