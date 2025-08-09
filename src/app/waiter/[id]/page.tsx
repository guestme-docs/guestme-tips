import WaiterPageClient from './WaiterPageClient'

export function generateStaticParams() {
  return [
    { id: 'ALEX001' },
    { id: 'ANNA001' },
    { id: 'IVAN001' }
  ]
}

export default async function WaiterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: waiterId } = await params
  
  return <WaiterPageClient waiterId={waiterId} />
}
