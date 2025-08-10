'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Confetti from '@/components/Confetti'

interface Waiter {
  id: string
  name: string
  photo: string
  restaurant: string
}

export default function ThankYouPage() {
  const router = useRouter()
  
  const getAssetPath = (path: string) => {
    // For local development, use empty base path
    // For production on GitHub Pages, use /guestme-tips
    const basePath = typeof window !== 'undefined' && window.location.hostname === 'guestme-docs.github.io' ? '/guestme-tips' : ''
    return `${basePath}${path}`
  }
  
  // Данные официанта (в реальном приложении будут приходить из URL параметров или состояния)
  const waiter: Waiter = {
    id: 'ALEX001',
    name: 'Алексей',
    photo: getAssetPath('/waiter-photo.jpg'),
            restaurant: 'Стейк-хаус BigFood'
  }

  const handleClose = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4">
      {/* Анимация конфети */}
      <Confetti />
      
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 p-6">
          
          {/* Логотип GuestMe */}
          <div className="text-center mb-8">
            <div className="w-40 h-20 flex items-center justify-center mx-auto mb-4">
              <Image src={getAssetPath('/guestme-logo.svg')} alt="GuestMe" width={144} height={56} className="w-36 h-14 object-contain" />
            </div>
          </div>

          {/* Благодарность */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Спасибо!</h1>
            <p className="text-lg text-gray-700 mb-6">
              Ваши чаевые успешно отправлены
            </p>
          </div>

          {/* Фото и имя официанта */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-20 h-20 rounded-2xl shadow-sm overflow-hidden border-2 border-gray-200/50">
              <Image 
                src={waiter.photo} 
                alt={waiter.name} 
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded-2xl"
              />
            </div>
            <div className="flex-1">
              <div className="font-bold text-2xl text-gray-900">{waiter.name}</div>
              <div className="text-gray-500 text-sm">{waiter.restaurant}</div>
            </div>
          </div>

          {/* Сообщение о времени получения */}
          <div className="text-center mb-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="text-emerald-700 font-medium text-lg mb-2">
                💝 Чаевые получены!
              </div>
              <p className="text-emerald-600 text-sm">
                {waiter.name} получит ваши чаевые в течение часа
              </p>
            </div>
          </div>

          {/* Кнопка закрыть */}
          <button
            onClick={handleClose}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold text-lg rounded-xl hover:from-emerald-700 hover:to-emerald-800 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-200 transform hover:scale-[1.02]"
          >
            Закрыть
          </button>

        </div>
      </div>
    </div>
  )
}
