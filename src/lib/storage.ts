import { promises as fs } from 'fs'
import path from 'path'

export async function readJson<T>(relativePath: string, fallback: T): Promise<T> {
  try {
    const filePath = path.join(process.cwd(), relativePath)
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data) as T
  } catch {
    return fallback
  }
}

export async function writeJson<T>(relativePath: string, value: T): Promise<void> {
  const filePath = path.join(process.cwd(), relativePath)
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), 'utf-8')
}