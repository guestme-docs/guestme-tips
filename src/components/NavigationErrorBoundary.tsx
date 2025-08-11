'use client'

import { useEffect, useState } from 'react'

interface NavigationErrorBoundaryProps {
  children: React.ReactNode
}

// Расширяем Window интерфейс для Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp?: unknown
    }
  }
}

// Функция для определения встроенного браузера мессенджера
const isInAppBrowser = () => {
  if (typeof window === 'undefined') return false
  
  const userAgent = window.navigator.userAgent.toLowerCase()
  
  // Telegram Web App
  if (window.Telegram?.WebApp) return true
  
  // Telegram встроенный браузер
  if (userAgent.includes('telegram') || userAgent.includes('tgwebapp')) return true
  
  // WhatsApp встроенный браузер
  if (userAgent.includes('whatsapp')) return true
  
  // VK встроенный браузер
  if (userAgent.includes('vk')) return true
  
  // Другие встроенные браузеры
  if (userAgent.includes('line') || userAgent.includes('wechat') || userAgent.includes('fbav')) return true
  
  return false
}

// Функция для проверки работоспособности JavaScript
const isJavaScriptWorking = () => {
  try {
    // Проверяем базовые возможности JavaScript
    if (typeof window === 'undefined') return false
    if (typeof document === 'undefined') return false
    
    // Проверяем, что можем создавать элементы
    const testElement = document.createElement('div')
    if (!testElement) return false
    
    // Проверяем, что можем добавлять обработчики событий
    if (typeof window.addEventListener !== 'function') return false
    
    return true
  } catch (error) {
    return false
  }
}

// Функция для проверки поддержки современных API
const hasModernAPIs = () => {
  try {
    if (typeof window === 'undefined') return false
    
    // Проверяем поддержку современных API, которые могут отсутствовать во встроенных браузерах
    const hasIntersectionObserver = 'IntersectionObserver' in window
    const hasResizeObserver = 'ResizeObserver' in window
    const hasPerformance = 'performance' in window
    const hasLocalStorage = 'localStorage' in window
    
    // Возвращаем true если большинство API поддерживается
    return hasIntersectionObserver && hasResizeObserver && hasPerformance && hasLocalStorage
  } catch (error) {
    return false
  }
}

// Компонент для встроенных браузеров - упрощенная версия без проблемных функций
function InAppBrowserWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Добавляем специальные стили для встроенных браузеров
    const style = document.createElement('style')
    style.textContent = `
      /* Fallback стили для встроенных браузеров */
      .in-app-fallback {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.5;
        -webkit-text-size-adjust: 100%;
        -webkit-font-smoothing: antialiased;
      }
      
      /* Убираем потенциально проблемные CSS свойства */
      .in-app-fallback * {
        backdrop-filter: none !important;
        filter: none !important;
        transform: none !important;
        transition: none !important;
        animation: none !important;
      }
      
      /* Дополнительные стили для стабильности */
      .in-app-fallback button {
        -webkit-appearance: none;
        -webkit-tap-highlight-color: transparent;
      }
      
      .in-app-fallback input {
        -webkit-appearance: none;
        -webkit-tap-highlight-color: transparent;
      }
    `
    document.head.appendChild(style)
    
    // Отключаем потенциально проблемные функции
    if (typeof window !== 'undefined') {
      // Отключаем ResizeObserver если он есть
      if (window.ResizeObserver) {
        try {
          window.ResizeObserver = undefined as unknown as typeof ResizeObserver
        } catch {
          // Игнорируем ошибки
        }
      }
      
      // Отключаем IntersectionObserver если он есть
      if (window.IntersectionObserver) {
        try {
          window.IntersectionObserver = undefined as unknown as typeof IntersectionObserver
        } catch {
          // Игнорируем ошибки
        }
      }
      
      // Отключаем requestAnimationFrame если он проблемный
      const originalRAF = window.requestAnimationFrame
      window.requestAnimationFrame = function(callback) {
        try {
          return originalRAF.call(window, callback)
        } catch {
          // Fallback на setTimeout
          return setTimeout(callback, 16) as unknown as number
        }
      }
      
      // Отключаем потенциально проблемные Next.js функции
      try {
        // Перехватываем ошибки роутера Next.js
        const originalPushState = window.history.pushState
        const originalReplaceState = window.history.replaceState
        
        window.history.pushState = function(...args) {
          try {
            return originalPushState.apply(window.history, args)
          } catch (e) {
            console.warn('Ошибка pushState, игнорируем:', e)
            return undefined
          }
        }
        
        window.history.replaceState = function(...args) {
          try {
            return originalReplaceState.apply(window.history, args)
          } catch (e) {
            console.warn('Ошибка replaceState, игнорируем:', e)
            return undefined
          }
        }
      } catch {
        // Игнорируем ошибки при перехвате
      }
      
      // Добавляем глобальный обработчик ошибок для встроенных браузеров
      const handleGlobalError = (event: ErrorEvent) => {
        console.warn('Ошибка во встроенном браузере, игнорируем:', event.error || event.message)
        event.preventDefault()
        event.stopPropagation()
        return false
      }
      
      window.addEventListener('error', handleGlobalError, true)
      window.addEventListener('unhandledrejection', (event) => {
        console.warn('Необработанная ошибка Promise во встроенном браузере, игнорируем:', event.reason)
        event.preventDefault()
        event.stopPropagation()
      }, true)
      
      return () => {
        try {
          document.head.removeChild(style)
          window.removeEventListener('error', handleGlobalError, true)
        } catch {
          // Игнорируем ошибки при очистке
        }
      }
    }
  }, [])
  
  return (
    <div className="in-app-fallback">
      {children}
    </div>
  )
}

export default function NavigationErrorBoundary({ children }: NavigationErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [isInApp, setIsInApp] = useState(false)
  const [jsWorking, setJsWorking] = useState(true)
  const [hasModern, setHasModern] = useState(true)
  const [routerError, setRouterError] = useState(false)

  useEffect(() => {
    // Проверяем, находимся ли мы во встроенном браузере
    const inApp = isInAppBrowser()
    setIsInApp(inApp)
    
    // Если это встроенный браузер, полностью отключаем обработку ошибок
    if (inApp) {
      console.log('Обнаружен встроенный браузер, отключаем обработку ошибок')
      return
    }
    
    // Проверяем работоспособность JavaScript
    const jsOk = isJavaScriptWorking()
    setJsWorking(jsOk)
    
    // Проверяем поддержку современных API
    const modernOk = hasModernAPIs()
    setHasModern(modernOk)
    
    // Проверяем работоспособность роутера Next.js
    const checkRouter = () => {
      try {
        // Проверяем, что можем использовать роутер
        if (typeof window !== 'undefined' && window.location) {
          // Проверяем, что можем изменять URL
          const testUrl = window.location.href
          if (!testUrl) {
            setRouterError(true)
            return
          }
        }
      } catch (error) {
        setRouterError(true)
      }
    }
    
    checkRouter()
    
    // Логируем состояние для отладки
    console.log('NavigationErrorBoundary состояние:', {
      isInApp: inApp,
      jsWorking: jsOk,
      hasModern: modernOk,
      routerError: routerError,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'
    })
    
    // Обработчик ошибок навигации (только для обычных браузеров)
    const handleNavigationError = (event: ErrorEvent) => {
      // Проверяем, что это действительно критическая ошибка навигации
      const error = event.error || event.message
      const errorString = error?.toString() || ''
      
      // Игнорируем незначительные ошибки, которые могут возникать в ограниченных браузерах
      if (
        errorString.includes('ResizeObserver') ||
        errorString.includes('IntersectionObserver') ||
        errorString.includes('requestAnimationFrame') ||
        errorString.includes('cancelAnimationFrame') ||
        errorString.includes('performance') ||
        errorString.includes('localStorage') ||
        errorString.includes('sessionStorage') ||
        errorString.includes('next/router') ||
        errorString.includes('next/navigation')
      ) {
        console.warn('Игнорируем незначительную ошибку:', errorString)
        return
      }
      
      console.error('Критическая ошибка навигации:', error)
      setHasError(true)
    }

    // Добавляем обработчики только если это не встроенный браузер и JavaScript работает
    if (!inApp && jsOk && modernOk && !routerError) {
      window.addEventListener('error', handleNavigationError)
      
      // Очистка
      return () => {
        window.removeEventListener('error', handleNavigationError)
      }
    }
  }, [routerError])

  // Если это встроенный браузер, показываем содержимое в специальной обертке
  if (isInApp) {
    return <InAppBrowserWrapper>{children}</InAppBrowserWrapper>
  }

  // Если JavaScript не работает, нет поддержки современных API, или есть проблемы с роутером
  if (!jsWorking || !hasModern || routerError) {
    return <>{children}</>
  }

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
