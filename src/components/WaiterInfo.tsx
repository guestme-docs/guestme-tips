import { Star } from 'lucide-react'

interface WaiterInfoProps {
  name: string
  rating: number
  totalTips: number
  avatar?: string
}

export default function WaiterInfo({ name, rating, totalTips, avatar }: WaiterInfoProps) {
  const stars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-5 w-5 ${
        i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
      }`}
    />
  ))

  return (
    <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-neutral-100 shadow-sm">
      <div className="flex-shrink-0">
        {avatar ? (
          <img src={avatar} alt={name} className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-semibold">
            {name.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex-1">
        <h2 className="text-2xl font-semibold text-neutral-900">{name}</h2>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1">
            {stars}
          </div>
          <span className="text-sm text-neutral-600">({rating.toFixed(1)})</span>
        </div>
        <p className="text-sm text-neutral-600 mt-1">
          Получено чаевых: <span className="font-medium">{totalTips.toLocaleString()} ₽</span>
        </p>
      </div>
    </div>
  )
}

