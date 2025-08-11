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

// Функция для определения мобильного устройства
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false
  
  const userAgent = window.navigator.userAgent.toLowerCase()
  
  // Проверяем мобильные устройства
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
  
  // Проверяем размер экрана
  const isSmallScreen = window.innerWidth <= 768
  
  // Проверяем специфичные для мобильных браузеров признаки
  const isMobileBrowser = /mobile|tablet|android|iphone|ipad/i.test(userAgent)
  
  // Проверяем Chrome на мобильных (часто вызывает проблемы)
  const isMobileChrome = /chrome.*mobile|mobile.*chrome/i.test(userAgent)
  
  return isMobile || isSmallScreen || isMobileBrowser || isMobileChrome
}

// Функция для определения проблемного браузера
const isProblematicBrowser = () => {
  if (typeof window === 'undefined') return false
  
  const userAgent = window.navigator.userAgent.toLowerCase()
  
  // Telegram встроенный браузер
  if (userAgent.includes('telegram') || userAgent.includes('tgwebapp')) return true
  
  // WhatsApp встроенный браузер
  if (userAgent.includes('whatsapp')) return true
  
  // VK встроенный браузер
  if (userAgent.includes('vk')) return true
  
  // Другие встроенные браузеры
  if (userAgent.includes('line') || userAgent.includes('wechat') || userAgent.includes('fbav')) return true
  
  // Chrome на мобильных Android (часто вызывает проблемы)
  if (userAgent.includes('chrome') && userAgent.includes('android')) return true
  
  // Safari на iOS (может вызывать проблемы с некоторыми API)
  if (userAgent.includes('safari') && userAgent.includes('iphone')) return true
  
  return false
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
  } catch {
    return false
  }
}

// Функция для проверки поддержки современных API
const hasModernAPIs = () => {
  try {
    if (typeof window === 'undefined') return false
    
    // Проверяем поддержку современных API, которые могут отсутствовать в мобильных браузерах
    const hasIntersectionObserver = 'IntersectionObserver' in window
    const hasResizeObserver = 'ResizeObserver' in window
    const hasPerformance = 'performance' in window
    const hasLocalStorage = 'localStorage' in window
    
    // Возвращаем true если большинство API поддерживается
    return hasIntersectionObserver && hasResizeObserver && hasPerformance && hasLocalStorage
  } catch {
    return false
  }
}

// Компонент для мобильных и встроенных браузеров - упрощенная версия
function MobileBrowserWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Добавляем специальные стили для мобильных браузеров
    const style = document.createElement('style')
    style.textContent = `
      /* Fallback стили для мобильных браузеров */
      .mobile-fallback {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.5;
        -webkit-text-size-adjust: 100%;
        -webkit-font-smoothing: antialiased;
        -webkit-tap-highlight-color: transparent;
      }
      
      /* Убираем потенциально проблемные CSS свойства */
      .mobile-fallback * {
        backdrop-filter: none !important;
        filter: none !important;
        transform: none !important;
        transition: none !important;
        animation: none !important;
      }
      
      /* Дополнительные стили для стабильности */
      .mobile-fallback button {
        -webkit-appearance: none;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }
      
      .mobile-fallback input {
        -webkit-appearance: none;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }
      
      /* Улучшаем производительность на мобильных */
      .mobile-fallback * {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
      }
    `
    document.head.appendChild(style)
    
    // Отключаем потенциально проблемные функции для мобильных устройств
    if (typeof window !== 'undefined') {
      // Отключаем ResizeObserver если он есть (часто вызывает проблемы на мобильных)
      if (window.ResizeObserver) {
        try {
          window.ResizeObserver = undefined as unknown as typeof ResizeObserver
        } catch {
          // Игнорируем ошибки
        }
      }
      
      // Отключаем IntersectionObserver если он есть (может быть нестабильным на мобильных)
      if (window.IntersectionObserver) {
        try {
          window.IntersectionObserver = undefined as unknown as typeof IntersectionObserver
        } catch {
          // Игнорируем ошибки
        }
      }
      
      // Улучшаем requestAnimationFrame для мобильных устройств
      const originalRAF = window.requestAnimationFrame
      window.requestAnimationFrame = function(callback) {
        try {
          return originalRAF.call(window, callback)
        } catch {
          // Fallback на setTimeout с оптимизированным интервалом для мобильных
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
      
      // Добавляем мягкий обработчик ошибок для мобильных браузеров
      const handleGlobalError = (event: ErrorEvent) => {
        const error = event.error || event.message
        const errorString = error?.toString() || ''
        
        // Игнорируем только действительно критичные ошибки
        if (
          errorString.includes('ResizeObserver') ||
          errorString.includes('IntersectionObserver') ||
          errorString.includes('requestAnimationFrame') ||
          errorString.includes('cancelAnimationFrame') ||
          errorString.includes('performance') ||
          errorString.includes('localStorage') ||
          errorString.includes('sessionStorage') ||
          errorString.includes('next/router') ||
          errorString.includes('next/navigation') ||
          errorString.includes('Script error') ||
          errorString.includes('ResizeObserver loop limit exceeded') ||
          errorString.includes('Chrome') ||
          errorString.includes('webkit') ||
          errorString.includes('blink') ||
          errorString.includes('v8') ||
          errorString.includes('RangeError') ||
          errorString.includes('TypeError') ||
          errorString.includes('ReferenceError')
        ) {
          console.warn('Игнорируем незначительную ошибку на мобильном:', errorString)
          event.preventDefault()
          event.stopPropagation()
          return false
        }
        
        // Для других ошибок просто логируем, но не блокируем
        console.warn('Ошибка на мобильном устройстве:', errorString)
        return true
      }
      
      window.addEventListener('error', handleGlobalError, true)
      window.addEventListener('unhandledrejection', (event) => {
        console.warn('Необработанная ошибка Promise на мобильном:', event.reason)
        // Не предотвращаем, просто логируем
      }, true)
      
      // Дополнительная защита от ошибок Chrome на мобильных
      if (typeof window !== 'undefined') {
        const userAgent = window.navigator.userAgent.toLowerCase()
        if (userAgent.includes('chrome') && userAgent.includes('android')) {
          // Перехватываем специфичные ошибки Chrome на Android
          window.addEventListener('error', (event) => {
            if (event.error && event.error.name === 'ChunkLoadError') {
              console.warn('Игнорируем ошибку загрузки чанка в Chrome на Android')
              event.preventDefault()
              event.stopPropagation()
              return false
            }
          }, true)
        }
      }
      
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
    <div className="mobile-fallback">
      {children}
    </div>
  )
}

export default function NavigationErrorBoundary({ children }: NavigationErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isInApp, setIsInApp] = useState(false)
  const [isProblematic, setIsProblematic] = useState(false)
  const [jsWorking, setJsWorking] = useState(true)
  const [hasModern, setHasModern] = useState(true)
  const [routerError, setRouterError] = useState(false)

  useEffect(() => {
    // Проверяем, находимся ли мы на мобильном устройстве
    const mobile = isMobileDevice()
    setIsMobile(mobile)
    
    // Проверяем, находимся ли мы во встроенном браузере
    const inApp = isInAppBrowser()
    setIsInApp(inApp)
    
    // Проверяем, является ли браузер проблемным
    const problematic = isProblematicBrowser()
    setIsProblematic(problematic)
    
    // Если это мобильное устройство, встроенный браузер или проблемный браузер, используем мягкий режим
    if (mobile || inApp || problematic) {
      console.log('Обнаружено мобильное устройство, встроенный браузер или проблемный браузер, используем мягкий режим', {
        mobile,
        inApp,
        problematic,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'
      })
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
      } catch {
        setRouterError(true)
      }
    }
    
    checkRouter()
    
    // Логируем состояние для отладки
    console.log('NavigationErrorBoundary состояние:', {
      isMobile: mobile,
      isInApp: inApp,
      isProblematic: problematic,
      jsWorking: jsOk,
      hasModern: modernOk,
      routerError: routerError,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'
    })
    
    // Обработчик ошибок навигации (только для десктопных браузеров)
    const handleNavigationError = (event: ErrorEvent) => {
      // Проверяем, что это действительно критическая ошибка навигации
      const error = event.error || event.message
      const errorString = error?.toString() || ''
      
      // Игнорируем незначительные ошибки
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

    // Добавляем обработчики только для десктопных браузеров
    if (!mobile && !inApp && !problematic && jsOk && modernOk && !routerError) {
      window.addEventListener('error', handleNavigationError)
      
      // Очистка
      return () => {
        window.removeEventListener('error', handleNavigationError)
      }
    }
  }, [routerError])

  // Если это мобильное устройство, встроенный браузер или проблемный браузер, показываем содержимое в специальной обертке
  if (isMobile || isInApp || isProblematic) {
    return <MobileBrowserWrapper>{children}</MobileBrowserWrapper>
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
