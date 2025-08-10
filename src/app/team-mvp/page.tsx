'use client'

import { useState } from 'react'
import { Star, MessageCircle, Heart, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AnimatedCounter from '@/components/AnimatedCounter'

interface Team {
  id: string
  name: string
  photo: string
  goal: string
  goalAmount: number
  currentAmount: number
  restaurant: string
}

export default function TeamMvpPage() {
  const router = useRouter()
  
  // Helper function to get correct asset path for production
  const getAssetPath = (path: string) => {
    const basePath = process.env.NODE_ENV === 'production' ? '/guestme-tips' : ''
    return `${basePath}${path}`
  }
  
  // Данные команды (в реальном приложении будут приходить из URL параметров)
  const team: Team = {
    id: 'TEAM002',
    name: 'Команда ресторана',
    photo: getAssetPath('/waiter-photo.jpg'),
    goal: 'Копим на корпоративный отдых',
    goalAmount: 500000,
    currentAmount: 150000,
    restaurant: 'Ресторан "У Алексея"'
  }

  // Состояние страницы
  const [billAmount] = useState<number>(2000) // Сумма чека
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState('')
  const [commentSubmitted, setCommentSubmitted] = useState<boolean>(false)
  const [commentExpanded, setCommentExpanded] = useState<boolean>(false)
  const [tipAmount, setTipAmount] = useState<number>(200) // 10% от чека по умолчанию
  const [tipPercentage, setTipPercentage] = useState<number>(10)
  const [payCommission, setPayCommission] = useState<boolean>(true)
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false)
  const [isEditingTip, setIsEditingTip] = useState<boolean>(false)

  // Процентные ставки для быстрого выбора
  const percentageOptions = [5, 10, 15, 20]

  // Обработчики
  const handlePercentageSelect = (percentage: number) => {
    setTipPercentage(percentage)
    setTipAmount(Math.round((billAmount * percentage) / 100))
  }

  const handleTipAmountChange = (amount: number) => {
    setTipAmount(amount)
    setTipPercentage(Math.round((amount / billAmount) * 100))
  }

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      setCommentSubmitted(true)
      console.log('Комментарий отправлен:', comment)
    }
  }

  const handleSubmit = () => {
    if (!agreeToTerms) {
      alert('Необходимо согласиться с условиями')
      return
    }
    
    const totalAmount = payCommission ? tipAmount + Math.round(tipAmount * 0.06) : tipAmount
    console.log('Отправка чаевых команде (MVP):', {
      team: team.name,
      tipAmount,
      commission: payCommission ? Math.round(tipAmount * 0.06) : 0,
      totalAmount,
      rating,
      comment
    })
    
    // Здесь будет логика отправки
    // После успешной отправки переходим на страницу благодарности
    const thankYouPath = process.env.NODE_ENV === 'production' ? '/guestme-tips/team-mvp-thank-you/' : '/team-mvp-thank-you'
    
    // Для статического экспорта используем window.location напрямую
    if (process.env.NODE_ENV === 'production') {
      window.location.href = thankYouPath
    } else {
      try {
        router.push(thankYouPath)
      } catch (error) {
        console.error('Ошибка навигации:', error)
        // Fallback: используем window.location
        window.location.href = thankYouPath
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
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Спасибо за отличный сервис!
          </h1>
          <p className="text-gray-600">
            Оставьте чаевые нашей команде
          </p>
        </div>

        {/* Сумма чека */}
        <div className="text-center mb-6">
          <p className="text-gray-600 text-sm">Сумма чека: <span className="text-lg font-semibold text-gray-900">{billAmount} ₽</span></p>
        </div>

        {/* Фото и информация о команде */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
              <img 
                src={team.photo} 
                alt={team.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{team.name}</h3>
              <p className="text-sm text-gray-600">{team.restaurant}</p>
              <p className="text-sm text-gray-600">{team.goal}</p>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Прогресс</span>
                  <span>{Math.round((team.currentAmount / team.goalAmount) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(team.currentAmount / team.goalAmount) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {team.currentAmount.toLocaleString()} ₽ из {team.goalAmount.toLocaleString()} ₽
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Оценка */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Star className="w-5 h-5 text-yellow-400 mr-2" />
            Оцените сервис
          </h3>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                disabled={commentSubmitted}
                className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                  rating >= star
                    ? 'border-yellow-400 bg-yellow-50 text-yellow-500'
                    : 'border-gray-200 text-gray-300 hover:border-gray-300'
                } ${commentSubmitted ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
              >
                <Star className="w-5 h-5 mx-auto" fill={rating >= star ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
        </div>

        {/* Комментарий */}
        {rating > 0 && (
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <MessageCircle className="w-5 h-5 text-blue-400 mr-2" />
              Комментарий
              <span className="text-sm font-normal text-gray-400 ml-2">(необязательно)</span>
            </h3>
            
            {!commentSubmitted ? (
              <div className="relative">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={comment.trim() ? Math.max(2, comment.split('\n').length) : 2}
                  placeholder="Поделитесь впечатлениями о сервисе..."
                  className="w-full p-4 pr-20 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 resize-none overflow-hidden placeholder:text-sm placeholder:text-gray-400"
                  style={{ minHeight: '3rem' }}
                />
                <button
                  onClick={handleCommentSubmit}
                  disabled={!comment.trim()}
                  className="absolute right-3 bottom-3 p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div 
                className={`border-2 border-gray-200 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  commentExpanded ? 'bg-gray-50' : ''
                }`}
                onClick={() => setCommentExpanded(!commentExpanded)}
              >
                <div className={`${commentExpanded ? '' : 'line-clamp-1'}`}>
                  {comment}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {commentExpanded ? 'Нажмите, чтобы свернуть' : 'Нажмите, чтобы развернуть'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Сумма чаевых */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4 text-center">
            Сумма чаевых
          </h3>
          
          <div className="text-center mb-6">
            {isEditingTip ? (
              <div className="flex items-center justify-center space-x-2">
                <input
                  type="number"
                  value={tipAmount}
                  onChange={(e) => handleTipAmountChange(Number(e.target.value))}
                  className="text-4xl font-bold text-emerald-600 text-center w-32 border-none outline-none"
                  min="0"
                />
                <span className="text-4xl font-bold text-emerald-600">₽</span>
              </div>
            ) : (
              <div 
                className="cursor-pointer"
                onClick={() => setIsEditingTip(true)}
              >
                <AnimatedCounter value={tipAmount} />
              </div>
            )}
          </div>

          {/* Быстрый выбор процентов */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {percentageOptions.map((percentage) => (
              <button
                key={percentage}
                onClick={() => handlePercentageSelect(percentage)}
                className={`py-3 px-2 rounded-lg border-2 transition-all duration-200 ${
                  tipPercentage === percentage
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {percentage}%
              </button>
            ))}
          </div>

          {/* Комиссия */}
          <div className="flex items-center space-x-3 mb-4">
            <input
              type="checkbox"
              id="commission"
              checked={payCommission}
              onChange={(e) => setPayCommission(e.target.checked)}
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor="commission" className="text-sm text-gray-700">
              Оплатить комиссию сервиса за команду
            </label>
          </div>

          {/* Согласие с условиями */}
          <div className="flex items-center space-x-3 mb-6">
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              Согласен с <a href="#" className="text-emerald-600 hover:underline">условиями</a>
            </label>
          </div>

          {/* Способ оплаты */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Способ оплаты</h4>
            <div className="border-2 border-emerald-500 rounded-lg p-4 bg-emerald-50">
              <div className="flex items-center justify-between">
                <span className="font-medium text-emerald-700">СБП</span>
                <span className="text-sm text-emerald-600">Быстро и безопасно</span>
              </div>
            </div>
          </div>

          {/* Кнопка оплаты */}
          <button
            onClick={handleSubmit}
            disabled={!agreeToTerms}
            className="w-full bg-emerald-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
          >
            Оплатить {payCommission ? tipAmount + Math.round(tipAmount * 0.06) : tipAmount} ₽
          </button>
        </div>
      </div>
    </div>
  )
}
