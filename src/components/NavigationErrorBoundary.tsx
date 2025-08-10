'use client'

import { useEffect, useState } from 'react'

interface NavigationErrorBoundaryProps {
  children: React.ReactNode
}

export default function NavigationErrorBoundary({ children }: NavigationErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Обработчик ошибок навигации
    const handleNavigationError = (event: ErrorEvent) => {
      console.error('Ошибка навигации:', event.error || event.message)
      setHasError(true)
    }

    // Добавляем обработчики
    window.addEventListener('error', handleNavigationError)
    
    // Очистка
    return () => {
      window.removeEventListener('error', handleNavigationError)
    }
  }, [])

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Ошибка навигации
          </h2>
          <p className="text-gray-600 mb-6">
            Произошла ошибка при переходе между страницами. Попробуйте обновить страницу.
          </p>
          <button
            onClick={() => {
              setHasError(false)
              window.location.reload()
            }}
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Обновить страницу
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
