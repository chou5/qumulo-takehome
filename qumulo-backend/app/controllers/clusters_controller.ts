import type { HttpContext } from '@adonisjs/core/http'
import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

const dataPath = (f: string) => path.join(process.cwd(), 'data', f)

export default class ClustersController {
  public async list() {
    const raw = await fs.readFile(dataPath('clusters.json'), 'utf-8').catch(() => '[]')
    return JSON.parse(raw)
  }

  public async create({ request, response }: HttpContext) {
    const { name, region } = request.only(['name', 'region'])
    if (!name || !region) return response.badRequest({ error: 'name and region are required' })

    const raw = await fs.readFile(dataPath('clusters.json'), 'utf-8').catch(() => '[]')
    const clusters = JSON.parse(raw)
    const row = { id: randomUUID(), name, region }
    clusters.push(row)
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true })
    await fs.writeFile(dataPath('clusters.json'), JSON.stringify(clusters, null, 2))
    return row
  }
}
