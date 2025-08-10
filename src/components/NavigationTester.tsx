'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface NavigationTest {
  name: string
  path: string
  description: string
}

const navigationTests: NavigationTest[] = [
  {
    name: 'Главная страница',
    path: '/',
    description: 'Переход на главную страницу'
  },
  {
    name: 'Страница чаевых',
    path: '/tip',
    description: 'Переход на страницу чаевых'
  },
  {
    name: 'Страница благодарности',
    path: '/thank-you',
    description: 'Переход на страницу благодарности'
  },
  {
    name: 'Настройки модуля',
    path: '/connect',
    description: 'Переход на страницу настроек'
  },
  {
    name: 'Кабинет официанта',
    path: '/waiter/ALEX001',
    description: 'Переход в личный кабинет официанта'
  }
]

export default function NavigationTester() {
  const router = useRouter()
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; error?: string; timestamp: number }>>({})
  const [isTesting, setIsTesting] = useState(false)

  const testNavigation = async (test: NavigationTest) => {
    setIsTesting(true)
    const startTime = Date.now()
    
    try {
      // Пытаемся перейти на страницу
      router.push(test.path)
      
      // Ждем немного для завершения навигации
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Проверяем, что URL изменился
      if (window.location.pathname === test.path) {
        setTestResults(prev => ({
          ...prev,
          [test.path]: {
            success: true,
            timestamp: Date.now() - startTime
          }
        }))
      } else {
        setTestResults(prev => ({
          ...prev,
          [test.path]: {
            success: false,
            error: 'URL не изменился',
            timestamp: Date.now() - startTime
          }
        }))
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [test.path]: {
          success: false,
          error: error instanceof Error ? error.message : 'Неизвестная ошибка',
          timestamp: Date.now() - startTime
        }
      }))
    } finally {
      setIsTesting(false)
    }
  }

  const runAllTests = async () => {
    setIsTesting(true)
    for (const test of navigationTests) {
      await testNavigation(test)
      // Небольшая пауза между тестами
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    setIsTesting(false)
  }

  const clearResults = () => {
    setTestResults({})
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Тестирование навигации
      </h2>
      
      <div className="space-y-4">
        <div className="flex space-x-3">
          <button
            onClick={runAllTests}
            disabled={isTesting}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTesting ? 'Тестирование...' : 'Запустить все тесты'}
          </button>
          
          <button
            onClick={clearResults}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Очистить результаты
          </button>
        </div>

        <div className="space-y-3">
          {navigationTests.map((test) => (
            <div key={test.path} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{test.name}</h3>
                <button
                  onClick={() => testNavigation(test)}
                  disabled={isTesting}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Тест
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{test.description}</p>
              <p className="text-xs text-gray-500">Путь: {test.path}</p>
              
              {testResults[test.path] && (
                <div className={`mt-2 p-2 rounded text-sm ${
                  testResults[test.path].success 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {testResults[test.path].success ? (
                    <span>✅ Успешно ({testResults[test.path].timestamp}ms)</span>
                  ) : (
                    <span>❌ Ошибка: {testResults[test.path].error}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Статистика тестов:</h4>
          <div className="text-sm text-gray-600">
            <p>Всего тестов: {navigationTests.length}</p>
            <p>Успешных: {Object.values(testResults).filter(r => r.success).length}</p>
            <p>С ошибками: {Object.values(testResults).filter(r => !r.success).length}</p>
            {Object.values(testResults).length > 0 && (
              <p>Среднее время: {Math.round(Object.values(testResults).reduce((sum, r) => sum + r.timestamp, 0) / Object.values(testResults).length)}ms</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
