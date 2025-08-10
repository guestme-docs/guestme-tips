'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'

export default function TeamThankYouPage() {
  const router = useRouter()
  
  // Helper function to get correct asset path for production
  const getAssetPath = (path: string) => {
    const basePath = process.env.NODE_ENV === 'production' ? '/guestme-tips' : ''
    return `${basePath}${path}`
  }

  // Запуск конфетти при загрузке страницы
  useEffect(() => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      
      // Конфетти слева
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      }))
      
      // Конфетти справа
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      }))
    }, 250)
  }, [])

  const handleClose = () => {
    // Для статического экспорта используем window.location напрямую
    const homePath = process.env.NODE_ENV === 'production' ? '/guestme-tips/' : '/'
    
    if (process.env.NODE_ENV === 'production') {
      window.location.href = homePath
    } else {
      try {
        router.push(homePath)
      } catch (error) {
        console.error('Ошибка навигации:', error)
        // Fallback: используем window.location
        window.location.href = homePath
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Логотип */}
        <div className="text-center mb-6">
          <img 
            src={getAssetPath('/guestme-logo.svg')} 
            alt="GuestMe" 
            className="h-12 w-auto mx-auto mb-4"
          />
        </div>

        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Спасибо! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Ваши чаевые успешно отправлены команде
          </p>
        </div>

        {/* Фото и информация о команде */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
              <img 
                src={getAssetPath('/waiter-photo.jpg')} 
                alt="Команда ресторана"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Команда ресторана</h3>
              <p className="text-sm text-gray-600">Ресторан "У Алексея"</p>
              <p className="text-sm text-gray-600">Копим на корпоративный отдых</p>
            </div>
          </div>
        </div>

        {/* Сообщение */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="text-6xl mb-4">💝</div>
            <p className="text-gray-700 mb-4">
              Команда получит ваши чаевые в течение часа
            </p>
            <p className="text-sm text-gray-500">
              Спасибо за поддержку и отличный отзыв!
            </p>
          </div>
        </div>

        {/* Кнопка закрытия */}
        <button
          onClick={handleClose}
          className="w-full bg-emerald-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-xl"
        >
          Закрыть
        </button>
      </div>
    </div>
  )
}
