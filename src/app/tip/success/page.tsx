import Link from 'next/link'
import { CheckCircle, Star } from 'lucide-react'
import { readJson } from '../../../lib/storage'

interface TipData {
  id: string
  code: string
  amount: number
  rating: number
  comment?: string
  recipientType: 'waiter' | 'team'
  waiterId?: string
  waiterName?: string
  restaurantName?: string
  createdAt: string
}

export default async function Page({ searchParams }: { searchParams?: Promise<{ tipId?: string }> }) {
  let tipData: TipData | null = null
  
  if (searchParams) {
    try {
      const params = await searchParams
      if (params?.tipId) {
        const tips = await readJson<TipData[]>("src/data/tips.json", [])
        tipData = tips.find(tip => tip.id === params.tipId) || null
      }
    } catch (error) {
      console.error('Error reading tip data:', error)
    }
  }

  return (
    <main className="container py-12 max-w-2xl mx-auto">
      <div className="text-center">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">Спасибо!</h1>
        
        {tipData ? (
          <>
            <p className="text-lg text-neutral-600 mb-6">
              Ваши чаевые в размере <span className="font-semibold text-green-600">{tipData.amount} ₽</span> 
              {tipData.recipientType === 'waiter' && tipData.waiterName && ` официанту ${tipData.waiterName}`}
              {tipData.recipientType === 'team' && ' команде ресторана'}
            </p>

            {/* Оценка */}
            {tipData.rating > 0 && (
              <div className="flex justify-center items-center mb-6">
                <span className="text-gray-600 mr-2">Ваша оценка:</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < tipData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Комментарий */}
            {tipData.comment && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                <span className="text-gray-600 text-sm">Комментарий:</span>
                <p className="text-gray-900 mt-1">{tipData.comment}</p>
              </div>
            )}

            {/* Получатель */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="text-sm text-gray-600 mb-2">Получатель:</div>
              <div className="font-semibold text-gray-900">
                {tipData.recipientType === 'waiter' && tipData.waiterName 
                  ? tipData.waiterName 
                  : 'Команда ресторана'
                }
              </div>
            </div>
          </>
        ) : (
          <p className="text-lg text-neutral-600 mb-8">
            Спасибо! Ваши чаевые успешно отправлены.
          </p>
        )}

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-green-800 mb-2">Что дальше?</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Чаевые будут зачислены в течение 24 часов</li>
            {tipData?.recipientType === 'waiter' && tipData.waiterName && (
              <li>• Официант {tipData.waiterName} будет уведомлен о вашем подарке</li>
            )}
            {tipData?.recipientType === 'team' && (
              <li>• Команда ресторана будет уведомлена о вашем подарке</li>
            )}
          </ul>
        </div>

        <Link 
          href="/" 
          className="inline-block gm-btn gm-btn-primary"
        >
          Закрыть
        </Link>
      </div>
    </main>
  )
}