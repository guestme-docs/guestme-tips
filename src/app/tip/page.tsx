'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, Clock, Receipt, User, CreditCard, CheckCircle, ArrowRight, AlertCircle, QrCode, Heart } from 'lucide-react'

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
  const [currentStep, setCurrentStep] = useState<'code-input' | 'initialization' | 'order' | 'rating' | 'amount' | 'payment' | 'thankyou'>('code-input')
  const [linkData, setLinkData] = useState<LinkData | null>(null)
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState('')
  const [showCommentField, setShowCommentField] = useState(false)
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

  // Получаем параметры из searchParams
  useEffect(() => {
    if (searchParams) {
      searchParams.then((resolvedParams) => {
        setLink(resolvedParams.link)
        setCode(resolvedParams.code)
        setSig(resolvedParams.sig)
        setTs(resolvedParams.ts)
        if (resolvedParams.code) {
          setCurrentStep('initialization')
        }
      })
    }
  }, [searchParams])

  // Инициализация по ссылке или коду
  useEffect(() => {
    if ((link || code) && currentStep === 'initialization') {
      // Имитация валидации подписи и временной метки
      setTimeout(() => {
        setLinkData({
          signature: sig || 'valid_signature_123',
          timestamp: ts ? parseInt(ts) : Date.now(),
          orderId: code || 'ORDER123'
        })
        setCurrentStep('order')
      }, 1000)
    }
  }, [link, code, sig, ts, currentStep])

  // Получение данных заказа
  useEffect(() => {
    if (currentStep === 'order' && linkData?.orderId) {
      fetchOrderData(linkData.orderId)
    }
  }, [currentStep, linkData])

  // Функция получения данных заказа
  const fetchOrderData = async (orderId: string) => {
    try {
      setError(null)
      const params = new URLSearchParams({ code: orderId })
      if (sig) params.append('sig', sig)
      if (ts) params.append('ts', ts)
      
      const response = await fetch(`/api/tips?${params.toString()}`)
      const data = await response.json()
      
      if (data.ok && data.orderData) {
        setOrderData(data.orderData)
        setCurrentStep('rating')
      } else {
        setError(data.error || 'Не удалось получить данные заказа')
      }
    } catch (error) {
      console.error('Error fetching order data:', error)
      setError('Ошибка при получении данных заказа')
    }
  }

  // Расчет комиссии сервиса (6% согласно спецификации)
  useEffect(() => {
    if (tipAmount > 0) {
      setServiceCommission(Math.ceil(tipAmount * 0.06)) // 6% комиссия, округление вверх
    }
  }, [tipAmount])

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputCode.trim()) {
      setCode(inputCode.trim())
      setCurrentStep('initialization')
    }
  }

  const handleRatingSelect = (value: number) => {
    setRating(value)
  }

  const handleAmountSelect = (amount: number) => {
    setTipAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    if (value && !isNaN(Number(value))) {
      setTipAmount(Math.ceil(Number(value))) // Округление вверх согласно спецификации
    }
  }

  const handlePercentageSelect = (percentage: number) => {
    if (orderData) {
      const amount = Math.ceil(orderData.orderAmount * (percentage / 100))
      setTipAmount(amount)
      setCustomAmount('')
    }
  }

  const handleContinue = () => {
    if (currentStep === 'rating' && rating > 0) {
      setCurrentStep('amount')
    } else if (currentStep === 'amount' && tipAmount > 0) {
      setCurrentStep('payment')
    }
  }

  const handlePayment = async () => {
    if (!paymentConsent) return
    
    setIsProcessing(true)
    setError(null)
    
    try {
      const response = await fetch('/api/tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: linkData?.orderId || code,
          amount: tipAmount,
          rating,
          comment,
          recipientType: orderData?.recipient.type || 'team',
          waiterId: orderData?.waiterId,
          waiterName: orderData?.waiter,
          restaurantName: orderData?.restaurant
        })
      })

      const data = await response.json()
      
      if (data.ok) {
        setCurrentStep('thankyou')
      } else {
        setError(data.error || 'Ошибка при обработке платежа')
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      setError('Ошибка при обработке платежа')
    } finally {
      setIsProcessing(false)
    }
  }

  const renderCodeInput = () => (
    <div className="text-center py-20">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <QrCode className="w-10 h-10 text-blue-600" />
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
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono"
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
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Receipt className="w-8 h-8 text-blue-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Инициализация ссылки</h1>
      <p className="text-gray-600 mb-6">Проверяем подпись и временную метку...</p>
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>
  )

  const renderHeader = () => (
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
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

  const renderOrderInfo = () => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Информация о заказе</h2>
        <div className="text-sm text-gray-500">
          <Clock className="w-4 h-4 inline mr-1" />
          {orderData?.orderDate ? new Date(orderData.orderDate).toLocaleString('ru-RU') : ''}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-600">Стол:</span>
          <span className="ml-2 font-medium">{orderData?.tableNumber}</span>
        </div>
        <div>
          <span className="text-gray-600">Сумма:</span>
          <span className="ml-2 font-medium">{orderData?.orderAmount} ₽</span>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        {orderData?.items.slice(0, 3).map((item: OrderItem, index: number) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-700">{item.name} × {item.quantity}</span>
            <span className="font-medium">{item.price} ₽</span>
          </div>
        ))}
        {orderData && orderData.items.length > 3 && (
          <div className="text-sm text-gray-500 text-center">
            ... и ещё {orderData.items.length - 3} позиций
          </div>
        )}
      </div>
    </div>
  )

  const renderRating = () => (
    <div className="space-y-6">
      {renderHeader()}
      {renderRecipient()}
      {renderOrderInfo()}

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Оцените сервис</h2>
        <p className="text-gray-600">Поделитесь своими впечатлениями</p>
      </div>

      {/* Рейтинг звездами */}
      <div className="text-center">
        <div className="flex justify-center space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingSelect(star)}
              className="p-2 hover:scale-110 transition-transform"
            >
              <Star
                className={`w-12 h-12 ${
                  star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-gray-600">{rating > 0 ? `Ваша оценка: ${rating} из 5` : 'Выберите оценку'}</p>
      </div>

      {/* Комментарий */}
      <div>
        {!showCommentField ? (
          <button
            onClick={() => setShowCommentField(true)}
            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
          >
            Оставить комментарий
          </button>
        ) : (
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Комментарий (до 500 символов)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              rows={3}
              maxLength={500}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Расскажите о своем опыте..."
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {comment.length}/500
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleContinue}
        disabled={rating === 0}
        className={`w-full gm-btn ${
          rating > 0
            ? 'gm-btn-primary'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Продолжить
      </button>
    </div>
  )

  const renderAmountSelection = () => (
    <div className="space-y-6">
      {renderHeader()}
      {renderRecipient()}
      {renderOrderInfo()}

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Сумма чаевых</h2>
        <p className="text-gray-600">Выберите сумму для благодарности</p>
      </div>

      {/* Процентные кнопки согласно спецификации */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Процент от суммы заказа</h3>
        <div className="grid grid-cols-2 gap-3">
          {[5, 10, 15, 20].map((percentage) => (
            <button
              key={percentage}
              onClick={() => handlePercentageSelect(percentage)}
              className={`p-4 rounded-xl border-2 transition-all ${
                tipAmount === Math.ceil((orderData?.orderAmount || 0) * (percentage / 100))
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-lg font-bold">{percentage}%</div>
              <div className="text-sm text-gray-600">
                {Math.ceil((orderData?.orderAmount || 0) * (percentage / 100))} ₽
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Быстрые суммы */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Быстрый выбор</h3>
        <div className="grid grid-cols-3 gap-3">
          {[100, 200, 300, 500, 1000, 2000].map((amount) => (
            <button
              key={amount}
              onClick={() => handleAmountSelect(amount)}
              className={`p-4 rounded-xl border-2 transition-all ${
                tipAmount === amount
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-lg font-bold">{amount}</div>
              <div className="text-sm text-gray-600">₽</div>
            </button>
          ))}
        </div>
      </div>

      {/* Своя сумма */}
      <div>
        <label htmlFor="customAmount" className="block text-sm font-medium text-gray-700 mb-2">
          Или введите свою сумму
        </label>
        <div className="relative">
          <input
            id="customAmount"
            type="number"
            min="10"
            step="1"
            value={customAmount}
            onChange={(e) => handleCustomAmountChange(e.target.value)}
            placeholder="Введите сумму"
            className="w-full p-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">₽</span>
        </div>
      </div>

      {/* Информация о комиссии */}
      {tipAmount > 0 && (
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Сумма чаевых:</span>
            <span className="font-semibold">{tipAmount} ₽</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Комиссия сервиса (6%):</span>
            <span className="font-semibold">{serviceCommission} ₽</span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
            <span>К оплате:</span>
            <span className="text-blue-600">{tipAmount + serviceCommission} ₽</span>
          </div>
        </div>
      )}

      <button
        onClick={handleContinue}
        disabled={tipAmount === 0}
        className={`w-full gm-btn ${
          tipAmount > 0
            ? 'gm-btn-primary'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Продолжить
      </button>
    </div>
  )

  const renderPayment = () => (
    <div className="space-y-6">
      {renderHeader()}
      {renderRecipient()}
      {renderOrderInfo()}

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Способ оплаты</h2>
        <p className="text-gray-600">Выберите удобный способ оплаты</p>
      </div>

      {/* Согласие на оферту (обязательно) */}
      <div className="bg-gray-50 rounded-xl p-4">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={paymentConsent}
            onChange={(e) => setPaymentConsent(e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            required
          />
          <span className="text-sm text-gray-700">
            Я согласен с <a href="#" className="text-blue-600 hover:underline">условиями оферты</a> *
          </span>
        </label>
      </div>

      {/* Способ оплаты - СБП согласно спецификации */}
      <div className="border-2 border-blue-500 rounded-2xl p-6 bg-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Система быстрых платежей (СБП)</h3>
              <p className="text-sm text-gray-600">Быстрая оплата через банковское приложение</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      {/* Итоговая сумма */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>К оплате:</span>
          <span className="text-blue-600">{tipAmount + serviceCommission} ₽</span>
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
        disabled={!paymentConsent || isProcessing}
        className={`w-full gm-btn ${
          paymentConsent && !isProcessing
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
          `Оплатить ${tipAmount + serviceCommission} ₽`
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
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Receipt className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Получение данных заказа</h1>
            <p className="text-gray-600 mb-6">Загружаем информацию о заказе...</p>
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            
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
      case 'rating':
        return renderRating()
      case 'amount':
        return renderAmountSelection()
      case 'payment':
        return renderPayment()
      case 'thankyou':
        return renderThankYou()
      default:
        return renderCodeInput()
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Основной контент */}
        {renderContent()}
      </div>
    </main>
  )
}