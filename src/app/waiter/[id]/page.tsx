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
  
  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center mobile-optimized">
      <div className="w-full max-w-[414px] bg-white shadow-2xl mobile-container">
        <WaiterPageClient waiterId={waiterId} />
      </div>
    </div>
  )
}
