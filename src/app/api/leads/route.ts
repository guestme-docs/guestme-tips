import { NextResponse } from 'next/server'
import { readJson, writeJson } from '../../../lib/storage'

export const dynamic = 'force-static'

type Lead = { id: string; workplace: string; name: string; phone: string; email: string; createdAt: string }

export async function POST(req: Request) {
  const form = await req.formData()
  const workplace = String(form.get('workplace') || '')
  const name = String(form.get('name') || '')
  const phone = String(form.get('phone') || '')
  const email = String(form.get('email') || '')
  if (!workplace || !name || !phone || !email) {
    return NextResponse.json({ ok: false, error: 'Заполните все поля' }, { status: 400 })
  }
  const id = Math.random().toString(36).slice(2)
  const lead: Lead = { id, workplace, name, phone, email, createdAt: new Date().toISOString() }
  const leads = await readJson<Lead[]>('src/data/leads.json', [])
  leads.push(lead)
  await writeJson('src/data/leads.json', leads)
  return NextResponse.json({ ok: true })
}