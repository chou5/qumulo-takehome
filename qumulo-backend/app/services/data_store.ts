// app/services/data_store.ts
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

export class DataStore {
  private static base = path.join(process.cwd(), 'data')

  static read<T = any>(file: string): T {
    const p = path.join(this.base, file)
    return JSON.parse(readFileSync(p, 'utf-8')) as T
  }

  static write(file: string, data: any): void {
    const p = path.join(this.base, file)
    writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8')
  }
}
