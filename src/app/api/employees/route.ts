import { NextResponse } from 'next/server'
import { readJson } from '../../../lib/storage'

export const dynamic = 'force-static'

type Employee = { code: string; name: string; role?: string }

export async function GET() {
  const employees = await readJson<Employee[]>('src/data/employees.json', [
    { code: '1001', name: 'Алексей', role: 'Официант' },
    { code: '1002', name: 'Мария', role: 'Бариста' },
    { code: '1003', name: 'Иван', role: 'Хостес' },
  ])
  return NextResponse.json({ employees })
}