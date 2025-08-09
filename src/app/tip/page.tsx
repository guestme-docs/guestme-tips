'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Receipt, CreditCard, CheckCircle, ArrowRight, AlertCircle, QrCode } from 'lucide-react'

// Интерфейсы для типизации
interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface RecipientData {
  type: 'waiter' | 'team'
  id?: string
  name: string
  surname?: string
  photo?: string
  goal?: string
  status: string
}

interface OrderData {
  restaurant: string
  waiter: string
  waiterId: string
  orderNumber: string
  orderAmount: number
  orderDate: string
  tableNumber: string
  items: OrderItem[]
  recipient: RecipientData
}

interface LinkData {
  signature: string
  timestamp: number
  orderId: string
}

export default function TipPage({ searchParams }: { searchParams?: Promise<{ link?: string; code?: string; sig?: string; ts?: string }> }) {
  const [currentStep, setCurrentStep] = useState<'code-input' | 'initialization' | 'order' | 'tip-form' | 'thankyou'>('code-input')
  const [linkData, setLinkData] = useState<LinkData | null>(null)
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [comment, setComment] = useState('')
  const [tipAmount, setTipAmount] = useState<number>(0)
  const [customAmount, setCustomAmount] = useState('')
  const [serviceCommission, setServiceCommission] = useState(0)
  const [paymentConsent, setPaymentConsent] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [link, setLink] = useState<string | undefined>()
  const [code, setCode] = useState<string | undefined>()
  const [sig, setSig] = useState<string | undefined>()
  const [ts, setTs] = useState<string | undefined>()
  const [error, setError] = useState<string | null>(null)
  const [inputCode, setInputCode] = useState('')
  const [serviceRating, setServiceRating] = useState<number>(0)
  const [payCommission, setPayCommission] = useState(true)

  // Получаем параметры из searchParams и URL
  useEffect(() => {
    const getParams = async () => {
      let resolvedParams: { link?: string; code?: string; sig?: string; ts?: string } = {}
      
      console.log('TipPage: Starting parameter resolution...')
      
      // Пробуем получить параметры из searchParams (Next.js 15)
      if (searchParams) {
        try {
          console.log('TipPage: Resolving searchParams...')
          resolvedParams = await searchParams
          console.log('TipPage: searchParams resolved:', resolvedParams)
        } catch (error) {
          console.log('Error resolving searchParams:', error)
        }
      }
      
      // Fallback: получаем параметры из URL напрямую
      if (!resolvedParams.code && typeof window !== 'undefined') {
        console.log('TipPage: Using URL fallback...')
        const urlParams = new URLSearchParams(window.location.search)
        resolvedParams = {
          link: urlParams.get('link') || undefined,
          code: urlParams.get('code') || undefined,
          sig: urlParams.get('sig') || undefined,
          ts: urlParams.get('ts') || undefined
        }
        console.log('TipPage: URL params:', resolvedParams)
      }
      
      // Устанавливаем параметры
      setLink(resolvedParams.link)
      setCode(resolvedParams.code)
      setSig(resolvedParams.sig)
      setTs(resolvedParams.ts)
      
      console.log('TipPage: Final params set:', resolvedParams)
      
      // Если есть код, переходим к инициализации
      if (resolvedParams.code) {
        console.log('TipPage: Found code, setting step to initialization:', resolvedParams.code)
        setCurrentStep('initialization')
      } else {
        console.log('TipPage: No code found, staying on code-input step')
      }
    }
    
    getParams()
  }, [searchParams])

  // Инициализация по ссылке или коду
  useEffect(() => {
    console.log('TipPage: Initialization useEffect triggered:', { 
      link, 
      code, 
      sig, 
      ts, 
      currentStep,
      hasLink: !!link,
      hasCode: !!code
    })
    
    if ((link || code) && currentStep === 'initialization') {
      console.log('TipPage: Starting initialization with:', { link, code, sig, ts })
      // Имитация валидации подписи и временной метки
      setTimeout(() => {
        const linkDataObj = {
          signature: sig || 'valid_signature_123',
          timestamp: ts ? parseInt(ts) : Date.now(),
          orderId: code || 'ORDER123'
        }
        console.log('TipPage: Setting linkData:', linkDataObj)
        setLinkData(linkDataObj)
        console.log('TipPage: Moving to order step')
        setCurrentStep('order')
      }, 1000)
    } else {
      console.log('TipPage: Skipping initialization - conditions not met')
    }
  }, [link, code, sig, ts, currentStep])

  // Функция получения данных заказа
  const fetchOrderData = useCallback(async (orderId: string) => {
    try {
      console.log('TipPage: fetchOrderData called with orderId:', orderId)
      console.log('TipPage: Current sig and ts values:', { sig, ts })
      setError(null)
      
      // Определяем тип сценария по параметрам
      const scenario = determineScenario(orderId, sig, ts)
      console.log('TipPage: Determined scenario:', scenario)
      
      // Создаем заглушку для GitHub Pages
      const mockOrderData = createMockOrderData(scenario, orderId)
      console.log('TipPage: Created mock order data:', mockOrderData)
      
      setOrderData(mockOrderData)
      setCurrentStep('tip-form')
      
    } catch (error) {
      console.error('TipPage: Error creating mock data:', error)
      setError('Ошибка при создании данных заказа')
    }
  }, [sig, ts])

  // Автоматический вызов fetchOrderData когда переходим на шаг 'order'
  useEffect(() => {
    if (currentStep === 'order' && linkData?.orderId) {
      console.log('TipPage: Automatically calling fetchOrderData for orderId:', linkData.orderId)
      fetchOrderData(linkData.orderId)
    }
  }, [currentStep, linkData, fetchOrderData])

  // Определение типа сценария
  const determineScenario = (orderId: string, signature?: string, timestamp?: string): string => {
    console.log('TipPage: Determining scenario for:', { 
      orderId, 
      signature: signature || 'undefined', 
      timestamp: timestamp || 'undefined',
      hasSignature: !!signature,
      hasTimestamp: !!timestamp
    })
    
    // Сценарий 1: Активный официант (есть подпись и timestamp)
    if (signature && timestamp) {
      console.log('TipPage: Scenario: Active waiter (has signature and timestamp)')
      return 'active_waiter'
    }
    
    // Сценарий 2: Неактивный официант (есть подпись, нет timestamp)
    if (signature && !timestamp) {
      console.log('TipPage: Scenario: Inactive waiter (has signature, no timestamp)')
      return 'inactive_waiter'
    }
    
    // Сценарий 3: Тест без подписи (нет подписи, есть timestamp)
    if (!signature && timestamp) {
      console.log('TipPage: Scenario: Test without signature (no signature, has timestamp)')
      return 'test_no_signature'
    }
    
    // Сценарий 4: Ввод кода вручную (нет ни подписи, ни timestamp)
    console.log('TipPage: Scenario: Manual code input (no signature, no timestamp)')
    return 'manual_input'
  }

  // Создание заглушки данных заказа
  const createMockOrderData = (scenario: string, orderId: string): OrderData => {
    console.log('TipPage: Creating mock data for scenario:', scenario)
    
    const baseData = {
      restaurant: 'Ресторан "У Моря"',
      waiter: 'Алексей Петров',
      waiterId: 'ALEX001',
      orderNumber: orderId,
      orderAmount: 2500,
      orderDate: new Date().toLocaleDateString('ru-RU'),
      tableNumber: '12',
      items: [
        { name: 'Стейк из тунца', quantity: 1, price: 1800 },
        { name: 'Салат Цезарь', quantity: 1, price: 450 },
        { name: 'Морс клюквенный', quantity: 1, price: 250 }
      ]
    }
    
    switch (scenario) {
      case 'active_waiter':
        return {
          ...baseData,
          recipient: {
            type: 'waiter',
            id: 'ALEX001',
            name: 'Алексей',
            surname: 'Петров',
            photo: '/guestme-logo.svg',
            goal: 'Накопить на отпуск',
            status: 'active'
          }
        }
      
      case 'inactive_waiter':
        return {
          ...baseData,
          recipient: {
            type: 'team',
            id: 'TEAM001',
            name: 'Команда ресторана',
            status: 'inactive'
          }
        }
      
      case 'test_no_signature':
        return {
          ...baseData,
          recipient: {
            type: 'waiter',
            id: 'TEST001',
            name: 'Тестовый официант',
            status: 'test'
          }
        }
      
      case 'manual_input':
      default:
        return {
          ...baseData,
          recipient: {
            type: 'waiter',
            id: 'MANUAL001',
            name: 'Официант',
            status: 'manual'
          }
        }
    }
  }

  // Расчет комиссии сервиса (6% согласно спецификации)
  useEffect(() => {
    if (tipAmount > 0) {
      setServiceCommission(Math.round(tipAmount * 0.06)) // 6% комиссия, округление вверх
    }
  }, [tipAmount])

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputCode.trim()) {
      setCode(inputCode.trim())
      setCurrentStep('initialization')
    }
  }

  const handleAmountSelect = (amount: number) => {
    setTipAmount(amount)
    setCustomAmount('')
    // Рассчитываем комиссию сервиса (6%)
    setServiceCommission(Math.round(amount * 0.06))
  }

  const handleCustomAmountChange = (value: string) => {
    // Убираем все символы кроме цифр
    const cleanValue = value.replace(/[^0-9]/g, '')
    setCustomAmount(cleanValue)
    const amount = parseInt(cleanValue) || 0
    setTipAmount(amount)
    // Рассчитываем комиссию сервиса (6%)
    setServiceCommission(Math.round(amount * 0.06))
  }

  const handlePercentageSelect = (percentage: number) => {
    if (orderData) {
      const amount = Math.round(orderData.orderAmount * (percentage / 100))
      setTipAmount(amount)
      setCustomAmount(amount.toString())
      // Рассчитываем комиссию сервиса (6%)
      setServiceCommission(Math.round(amount * 0.06))
    }
  }

  const handlePayment = async () => {
    if (!paymentConsent) return

    setIsProcessing(true)
    setError(null)

    try {
      // Имитация обработки платежа для GitHub Pages
      console.log('TipPage: Processing payment:', {
        code: linkData?.orderId || code,
        amount: tipAmount,
        comment,
        recipientType: orderData?.recipient.type || 'team',
        waiterId: orderData?.waiterId,
        waiterName: orderData?.waiter,
        restaurantName: orderData?.restaurant
      })

      // Имитация задержки обработки
      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log('TipPage: Payment processed successfully')
      setCurrentStep('thankyou')

    } catch (error) {
      console.error('Error processing payment:', error)
      setError('Ошибка при обработке платежа')
    } finally {
      setIsProcessing(false)
    }
  }

  const renderCodeInput = () => (
    <div className="text-center py-20">
      <div className="w-20 h-20 gm-bg-soft rounded-full flex items-center justify-center mx-auto mb-6">
        <QrCode className="w-10 h-10 gm-text" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Оставить чаевые</h1>
      <p className="text-gray-600 mb-8 text-lg">Введите код заказа или отсканируйте QR-код</p>
      
      <form onSubmit={handleCodeSubmit} className="max-w-md mx-auto">
        <div className="mb-6">
          <label htmlFor="orderCode" className="block text-sm font-medium text-gray-700 mb-2">
            Код заказа
          </label>
          <input
            id="orderCode"
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Например: ORDER123"
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[--gm-primary] focus:border-[--gm-primary] text-center text-lg font-mono"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full gm-btn gm-btn-primary"
        >
          Продолжить
        </button>
      </form>
      
      <div className="mt-8 text-sm text-gray-500">
        <p>Код заказа можно найти:</p>
        <ul className="mt-2 space-y-1">
          <li>• На чеке</li>
          <li>• На столе в виде QR-кода</li>
          <li>• У официанта</li>
        </ul>
      </div>
    </div>
  )

  const renderInitialization = () => (
    <div className="text-center py-20">
      <div className="w-16 h-16 gm-bg-soft rounded-full flex items-center justify-center mx-auto mb-6">
        <Receipt className="w-8 h-8 gm-text" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Инициализация ссылки</h1>
      <p className="text-gray-600 mb-6">Проверяем подпись и временную метку...</p>
      <div className="w-8 h-8 border-4 border-[--gm-primary] border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>
  )

  const renderHeader = () => (
    <div className="text-center mb-8">
      <div className="w-16 h-16 gm-bg-soft rounded-full flex items-center justify-center mx-auto mb-4">
        <img src="/guestme-logo.svg" alt="GuestMe" className="w-10 h-10" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Спасибо, что были с нами!</h1>
    </div>
  )

  const renderRecipient = () => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          {orderData?.recipient.photo ? (
            <img src={orderData.recipient.photo} alt="" className="w-16 h-16 object-cover" />
          ) : (
            <span className="text-gray-500 text-2xl">
              {orderData?.recipient.type === 'waiter' 
                ? orderData?.recipient.name?.[0] || 'О'
                : 'К'
              }
            </span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">
            {orderData?.recipient.type === 'waiter' 
              ? `${orderData?.recipient.name} ${orderData?.recipient.surname || ''}`
              : orderData?.recipient.name
            }
          </h3>
          {orderData?.recipient.goal && (
            <p className="text-gray-600 text-sm">Цель: {orderData.recipient.goal}</p>
          )}
        </div>
      </div>
    </div>
  )

  const renderTipForm = () => (
    <div className="space-y-6">
      {/* Заголовок */}
      {renderHeader()}
      
      {/* Информация о получателе */}
      {renderRecipient()}
      
      {/* Сумма заказа - только сумма */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gm-bg-soft rounded-full flex items-center justify-center">
              <Receipt className="w-5 h-5 gm-text" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Сумма заказа</h3>
              <p className="text-sm text-gray-600">Заказ #{orderData?.orderNumber}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{orderData?.orderAmount} ₽</div>
          </div>
        </div>
      </div>

      {/* Оценка сервиса и комментарий */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Оцените сервис</h3>
        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setServiceRating(star)}
              className={`text-4xl transition-all hover:scale-110 ${
                star <= serviceRating
                  ? 'text-yellow-400'
                  : 'text-gray-300 hover:text-gray-400'
              }`}
            >
              ★
            </button>
          ))}
        </div>
        <div className="text-center mt-3">
          <span className="text-sm text-gray-600">
            {serviceRating === 0 && 'Нажмите на звездочку для оценки'}
            {serviceRating === 1 && 'Плохо'}
            {serviceRating === 2 && 'Неудовлетворительно'}
            {serviceRating === 3 && 'Удовлетворительно'}
            {serviceRating === 4 && 'Хорошо'}
            {serviceRating === 5 && 'Отлично'}
          </span>
        </div>
        
        {/* Комментарий - автоматически раскрывается при оценке */}
        {serviceRating > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Комментарий (необязательно)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Оставьте отзыв о сервисе..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[--gm-primary] focus:outline-none resize-none"
            />
          </div>
        )}
      </div>

      {/* Выбор суммы чаевых */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Выберите сумму чаевых</h3>
        
        {/* Инструкция для пользователя */}
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 mb-2">Введите сумму чаевых или выберите процент от заказа</p>
        </div>
        
        {/* Сумма чаевых крупным шрифтом с возможностью редактирования */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={tipAmount || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '')
                const amount = parseInt(value) || 0
                setTipAmount(amount)
                setCustomAmount(value)
                setServiceCommission(Math.round(amount * 0.06))
              }}
              className="text-4xl font-bold text-center bg-transparent border-none outline-none w-32 text-gray-900 focus:ring-2 focus:ring-[--gm-primary] focus:ring-opacity-50 rounded-lg px-2 py-1 transition-all duration-200 hover:bg-gray-50"
              placeholder="0"
            />
            <span className="text-4xl font-bold text-gray-900 ml-2">₽</span>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500">Нажмите на поле и введите сумму</p>
          </div>
        </div>
        
        {/* Быстрый выбор процентов */}
        <div className="grid grid-cols-4 gap-3">
          {[5, 10, 15, 20].map((percentage) => (
            <button
              key={percentage}
              onClick={() => handlePercentageSelect(percentage)}
              className={`p-3 rounded-xl border-2 transition-colors ${
                tipAmount === Math.round((orderData?.orderAmount || 0) * (percentage / 100))
                  ? 'gm-border gm-bg-soft gm-text'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-lg font-semibold">{percentage}%</div>
              <div className="text-xs text-gray-600">
                {Math.round((orderData?.orderAmount || 0) * (percentage / 100))} ₽
              </div>
            </button>
          ))}
        </div>
      </div>



      {/* Согласие с условиями */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="space-y-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={payCommission}
              onChange={(e) => setPayCommission(e.target.checked)}
              className="mt-1 w-5 h-5 gm-checkbox border-gray-300 rounded focus:ring-[--gm-primary]"
            />
            <span className="text-sm text-gray-700">
              Согласен оплатить комиссию сервиса за официанта (6%)
            </span>
          </label>
          
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={paymentConsent}
              onChange={(e) => setPaymentConsent(e.target.checked)}
              className="mt-1 w-5 h-5 gm-checkbox border-gray-300 rounded focus:ring-[--gm-primary]"
              required
            />
            <span className="text-sm text-gray-700">
              Согласен с <a href="#" className="gm-text hover:underline">условиями оферты</a> *
            </span>
          </label>
        </div>
      </div>

      {/* Способ оплаты - СБП согласно спецификации */}
      <div className="border-2 gm-border rounded-2xl p-6 gm-bg-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--gm-primary)' }}>
              <CreditCard className="w-6 h-6 text-neutral-900" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Система быстрых платежей (СБП)</h3>
              <p className="text-sm text-gray-600">Быстрая оплата через банковское приложение</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 gm-text" />
        </div>
      </div>

      {/* Отображение ошибки */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={!paymentConsent || isProcessing || tipAmount === 0}
        className={`w-full gm-btn ${
          paymentConsent && !isProcessing && tipAmount > 0
            ? 'gm-btn-primary'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Обработка...
          </div>
        ) : (
          `Оплатить ${tipAmount + (payCommission ? serviceCommission : 0)} ₽`
        )}
      </button>
    </div>
  )

  const renderThankYou = () => (
    <div className="text-center py-20">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Спасибо!</h1>
      <p className="text-gray-600 mb-8 text-lg">
        Ваши чаевые в размере <span className="font-semibold">{tipAmount} ₽</span> успешно отправлены
      </p>
      <p className="text-gray-600 mb-8">
        {orderData?.recipient.type === 'waiter' 
          ? `Официант ${orderData?.recipient.name} получит чаевые в течение 24 часов`
          : 'Команда ресторана получит чаевые в течение 24 часов'
        }
      </p>
      
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-block w-full md:w-auto gm-btn gm-btn-primary"
        >
          Закрыть
        </Link>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (currentStep) {
      case 'code-input':
        return renderCodeInput()
      case 'initialization':
        return renderInitialization()
      case 'order':
        return (
          <div className="text-center py-20">
      <div className="w-16 h-16 gm-bg-soft rounded-full flex items-center justify-center mx-auto mb-6">
        <Receipt className="w-8 h-8 gm-text" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Получение данных заказа</h1>
            <p className="text-gray-600 mb-6">Загружаем информацию о заказе...</p>
            <div className="w-8 h-8 border-4 border-[--gm-primary] border-t-transparent rounded-full animate-spin mx-auto"></div>
            
            {/* Отображение ошибки */}
            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3 max-w-md mx-auto">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800 text-sm">{error}</span>
                <div className="mt-3 space-y-2">
                  <button
                    onClick={() => {
                      setError(null)
                      if (linkData?.orderId) {
                        fetchOrderData(linkData.orderId)
                      }
                    }}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Попробовать снова
                  </button>
                  <Link
                    href="/"
                    className="block w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm text-center"
                  >
                    На главную
                  </Link>
                </div>
              </div>
            )}
          </div>
        )
      case 'tip-form':
        return renderTipForm()
      case 'thankyou':
        return renderThankYou()
      default:
        return renderCodeInput()
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Основной контент */}
        {renderContent()}
      </div>
    </main>
  )
}