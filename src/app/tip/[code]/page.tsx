import { redirect } from 'next/navigation'

export function generateStaticParams() {
  return [
    { code: 'TEST001' },
    { code: 'TEST002' },
    { code: 'TEST003' },
    { code: 'ORDER001' },
    { code: 'ORDER002' }
  ]
}

export default async function TipCodePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  
  // Перенаправляем на основную страницу чаевых с кодом
  redirect(`/tip?code=${encodeURIComponent(code)}`)
}