'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const router = useRouter()

  const handleNavigation = (href: string) => {
    console.log('Попытка навигации на:', href)
    try {
      // Для локальной разработки используем router.push
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        router.push(href)
      } else {
        // Для GitHub Pages используем window.location
        window.location.href = href
      }
    } catch (error) {
      console.error('Ошибка навигации:', error)
      // Fallback: используем window.location
      console.log('Используем fallback навигацию на:', href)
      window.location.href = href
    }
  }

  // Функция для получения полного пути с учетом basePath
  const getFullPath = (path: string) => {
    // Проверяем, находимся ли мы на GitHub Pages
    const isGitHubPages = window.location.hostname === 'guestme-docs.github.io' || 
                         window.location.pathname.startsWith('/guestme-tips')
    const basePath = isGitHubPages ? '/guestme-tips' : ''
    const fullPath = `${basePath}${path}`
    console.log('getFullPath:', { path, basePath, fullPath, isGitHubPages, hostname: window.location.hostname, pathname: window.location.pathname })
    return fullPath
  }

  // Логируем загрузку страницы
  useEffect(() => {
    console.log('Главная страница загружена')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('hostname:', window.location.hostname)
    console.log('pathname:', window.location.pathname)
    console.log('isGitHubPages:', window.location.hostname === 'guestme-docs.github.io' || window.location.pathname.startsWith('/guestme-tips'))
  }, [])

  return (
    <main className="container py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">
          GuestMe Tips - Система чаевых
        </h1>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Сценарии оплаты чаевых
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
                  <div className="font-medium text-neutral-900">Оплата официанту</div>
                  <div className="text-sm text-neutral-600">Индивидуальные чаевые для конкретного официанта</div>
                </button>

                <button
                  onClick={() => handleNavigation(getFullPath('/team-tip?code=TEAM001&sig=test_signature&ts=1734567890'))}
                  className="block w-full p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="font-medium text-neutral-900">Оплата команде</div>
                  <div className="text-sm text-neutral-600">Чаевые для всей команды ресторана</div>
                </button>

                <button
                  onClick={() => handleNavigation(getFullPath('/team-mvp?code=TEAM002&sig=test_signature&ts=1734567890'))}
                  className="block w-full p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="font-medium text-neutral-900">Оплата команде (MVP)</div>
                  <div className="text-sm text-neutral-600">Упрощенная версия для команды</div>
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
                  onClick={() => handleNavigation(getFullPath('/thank-you'))}
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