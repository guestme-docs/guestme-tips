'use client'

import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  const handleNavigation = (href: string) => {
    try {
      router.push(href)
    } catch (error) {
      console.error('Ошибка навигации:', error)
      // Fallback: используем window.location
      window.location.href = getFullPath(href)
    }
  }

  // Функция для получения полного пути с учетом basePath
  const getFullPath = (path: string) => {
    const basePath = process.env.NODE_ENV === 'production' ? '/guestme-tips' : ''
    return `${basePath}${path}`
  }

  return (
    <main className="container py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">
          GuestMe Tips - Система чаевых
        </h1>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Тестирование системы чаевых
            </h2>

            <div className="space-y-3">
              <p className="text-neutral-600 text-sm">
                Выберите один из вариантов для тестирования:
              </p>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => handleNavigation(getFullPath('/tip?code=TEST001&sig=test_signature&ts=1734567890'))}
                  className="block w-full p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="font-medium text-neutral-900">Тест с активным официантом</div>
                  <div className="text-sm text-neutral-600">Код: TEST001, sig: test_signature, ts: 1734567890 (пропуск валидации)</div>
                </button>

                <button
                  onClick={() => handleNavigation(getFullPath('/tip?code=TEST002&sig=test_signature&ts=1734567890'))}
                  className="block w-full p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="font-medium text-neutral-900">Тест с неактивным официантом</div>
                  <div className="text-sm text-neutral-600">Код: TEST002, sig: test_signature, ts: 1734567890 (пропуск валидации)</div>
                </button>

                <button
                  onClick={() => handleNavigation(getFullPath('/tip?code=TEST003&sig=test_signature&ts=1734567890'))}
                  className="block w-full p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="font-medium text-neutral-900">Тест с несуществующим официантом</div>
                  <div className="text-sm text-neutral-600">Код: TEST003, sig: test_signature, ts: 1734567890 (пропуск валидации)</div>
                </button>

                <button
                  onClick={() => handleNavigation(getFullPath('/tip?code=TEST004&sig=test_signature&ts=1734567890'))}
                  className="block w-full p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="font-medium text-neutral-900">Тест с истекшим временем</div>
                  <div className="text-sm text-neutral-600">Код: TEST004, sig: test_signature, ts: 1734567890 (пропуск валидации)</div>
                </button>

                <button
                  onClick={() => handleNavigation(getFullPath('/tip?code=TEST005&sig=test_signature&ts=1734567890'))}
                  className="block w-full p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="font-medium text-neutral-900">Тест с неверной подписью</div>
                  <div className="text-sm text-neutral-600">Код: TEST005, sig: test_signature, ts: 1734567890 (пропуск валидации)</div>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Административные функции
            </h2>

            <div className="space-y-3">
              <p className="text-neutral-600 text-sm">
                Доступ к административным функциям:
              </p>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => handleNavigation(getFullPath('/connect'))}
                  className="block w-full p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="font-medium text-neutral-900">Подключение модуля</div>
                  <div className="text-sm text-neutral-600">Настройка и управление системой чаевых</div>
                </button>

                <button
                  onClick={() => handleNavigation(getFullPath('/waiter/ALEX001'))}
                  className="block w-full p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="font-medium text-neutral-900">Личный кабинет официанта</div>
                  <div className="text-sm text-neutral-600">Просмотр статистики и получение чаевых</div>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Демонстрация
            </h2>

            <div className="space-y-3">
              <p className="text-neutral-600 text-sm">
                Демонстрационные страницы:
              </p>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => handleNavigation('/thank-you')}
                  className="block w-full p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="font-medium text-neutral-900">Страница благодарности</div>
                  <div className="text-sm text-neutral-600">Демонстрация страницы после оплаты</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}