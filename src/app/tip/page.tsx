'use client'

import { useState } from 'react'
import { Star, MessageCircle, Send, Target } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import AnimatedCounter from '@/components/AnimatedCounter'
import { getStaticAssetPath } from '@/utils/paths'

interface Waiter {
  id: string
  name: string
  photo: string
  goal: string
  goalAmount: number
  currentAmount: number
  restaurant: string
}

export default function TipPage() {
  const router = useRouter()
  
  // Убираем локальную функцию getAssetPath, используем импортированную
  
  // Данные официанта (в реальном приложении будут приходить из URL параметров)
  const waiter: Waiter = {
    id: 'ALEX001',
    name: 'Алексей',
          photo: getStaticAssetPath('/waiter-photo.jpg'),
    goal: 'Коплю на обучение в кулинарной школе',
    goalAmount: 150000,
    currentAmount: 45000,
            restaurant: 'Стейк-хаус BigFood'
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

  // Функция для умной обрезки текста по 2 строкам
  const truncateText = (text: string, maxLines: number = 2) => {
    const lines = text.split('\n')
    
    // Максимальная длина строки с учетом ширины поля и отступов
    // Доступная ширина ~256px, примерно 35-38 символов на строку
    const maxLineLength = 35
    
    // Если строк меньше или равно maxLines, проверяем длину каждой строки
    if (lines.length <= maxLines) {
      // Проверяем, не слишком ли длинные строки
      const hasLongLines = lines.some(line => line.length > maxLineLength)
      if (!hasLongLines) {
        return { text: text, truncated: false }
      }
    }
    
    // Берем первые maxLines строк
    const truncatedLines = lines.slice(0, maxLines)
    
    // Обрабатываем каждую строку, обрезая длинные
    for (let i = 0; i < truncatedLines.length; i++) {
      if (truncatedLines[i].length > maxLineLength) {
        // Оставляем место для многоточия и небольшой запас
        truncatedLines[i] = truncatedLines[i].substring(0, maxLineLength - 3)
      }
    }
    
    return { 
      text: truncatedLines.join('\n'), 
      truncated: true 
    }
  }

  

  const handleSubmit = () => {
    if (!agreeToTerms) {
      alert('Необходимо согласиться с условиями')
      return
    }
    
    const totalAmount = payCommission ? tipAmount + Math.round(tipAmount * 0.06) : tipAmount
    console.log('Отправка чаевых:', {
      waiter: waiter.name,
      tipAmount,
      commission: payCommission ? Math.round(tipAmount * 0.06) : 0,
      totalAmount,
      rating,
      comment
    })
    
    // Здесь будет логика отправки
    // После успешной отправки переходим на страницу благодарности
    router.push('/thank-you')
  }



  // Расчет прогресса цели
  const goalProgress = (waiter.currentAmount / waiter.goalAmount) * 100
  const commissionAmount = payCommission ? Math.round(tipAmount * 0.06) : 0
  const totalAmount = tipAmount + commissionAmount

  return (
         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4">
       <div className="max-w-md mx-auto px-4">
         <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 p-6">
           
                      {/* 1. Заголовок с благодарностью */}
            <div className="text-center mb-6">
                            <div className="w-40 h-20 flex items-center justify-center mx-auto mb-3">
                 <Image src={getStaticAssetPath('/guestme-logo.svg')} alt="GuestMe" width={144} height={56} className="w-36 h-14 object-contain" />
               </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Спасибо, что были с нами!</h1>
              <div className="text-lg text-gray-700 mb-2">Сумма чека: {billAmount.toLocaleString()} ₽</div>
              <p className="text-gray-500 text-sm">Оставьте чаевые и отзыв для нашего официанта</p>
            </div>

          {/* 2. Фото и имя официанта */}
          <div className="flex items-center space-x-4 mb-6">
                         <div className="w-16 h-16 rounded-2xl shadow-sm overflow-hidden border-2 border-gray-200/50">
                             <Image 
                 src={waiter.photo} 
                 alt={waiter.name} 
                 width={64}
                 height={64}
                 className="w-16 h-16 object-cover rounded-2xl"
               />
            </div>
            <div className="flex-1">
              <div className="font-bold text-xl text-gray-900">{waiter.name}</div>
              <div className="text-gray-500 text-sm">{waiter.restaurant}</div>
            </div>
          </div>

                     {/* 3. Цель (на что он копит) */}
           <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-200/50 mb-6">
             <div className="flex items-center space-x-3 mb-3">
               <Target className="w-5 h-5 text-emerald-600" />
               <h3 className="font-semibold text-gray-900">Цель</h3>
             </div>
             <p className="text-gray-700 text-sm mb-3">{waiter.goal}</p>
             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-gray-600">Прогресс</span>
                 <span className="font-medium text-gray-900">{waiter.currentAmount.toLocaleString()} / {waiter.goalAmount.toLocaleString()} ₽</span>
               </div>
               <div className="w-full bg-gray-200 rounded-full h-2">
                 <div 
                   className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300" 
                   style={{ width: `${goalProgress}%` }}
                 ></div>
               </div>
             </div>
           </div>

                             

          {/* 5. Оценка (блок со звездочками) */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Оценка сервиса</label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => !commentSubmitted && setRating(star)}
                  disabled={commentSubmitted}
                  className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-110 ${
                    star <= rating 
                      ? 'text-yellow-500 bg-yellow-50 shadow-sm' 
                      : 'text-gray-300 hover:text-gray-400 hover:bg-gray-50'
                  } ${commentSubmitted ? 'cursor-not-allowed opacity-60' : 'hover:scale-110'}`}
                >
                  <Star className={`w-7 h-7 ${star <= rating ? 'fill-current drop-shadow-sm' : ''}`} />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <div className="text-center text-sm text-gray-500 mt-2">
                {rating === 1 && 'Плохо'}
                {rating === 2 && 'Не очень'}
                {rating === 3 && 'Нормально'}
                {rating === 4 && 'Хорошо'}
                {rating === 5 && 'Отлично!'}
              </div>
            )}
          </div>

          {/* 6. Если оценка поставлена - поле для ввода комментария с встроенной кнопкой отправить */}
          {rating > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Комментарий
                <span className="text-gray-400 font-normal ml-1">(необязательно)</span>
              </label>
              <div className="relative">
                {!commentSubmitted ? (
                  <>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={comment.trim() ? Math.max(2, comment.split('\n').length) : 2}
                      placeholder="Поделитесь впечатлениями о сервисе..."
                      className="w-full p-4 pr-20 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 resize-none placeholder:text-sm placeholder:text-gray-400"
                      style={{ 
                        minHeight: '3rem',
                        height: 'auto',
                        overflow: 'hidden'
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement
                        target.style.height = 'auto'
                        target.style.height = Math.max(48, target.scrollHeight) + 'px'
                      }}
                    />
                    <button
                      onClick={handleCommentSubmit}
                      className="absolute right-3 bottom-3 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      title="Отправить комментарий"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div 
                    onClick={() => setCommentExpanded(!commentExpanded)}
                    className="cursor-pointer"
                  >
                    {commentExpanded ? (
                      <div className="w-full p-4 border-2 border-gray-200 rounded-xl bg-gray-50 transition-all duration-200 cursor-pointer">
                        <div className="text-gray-900 whitespace-pre-wrap leading-relaxed break-words overflow-wrap-anywhere">
                          {comment}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full p-4 border-2 border-gray-200 rounded-xl bg-gray-50 transition-all duration-200 cursor-pointer">
                        {(() => {
                          const { text: truncatedText, truncated } = truncateText(comment)
                          return (
                            <>
                              <div className="text-gray-900 whitespace-pre-wrap leading-relaxed" style={{ 
                                lineHeight: '1.5rem',
                                maxHeight: '3rem',
                                overflow: 'hidden'
                              }}>
                                {truncatedText}
                              </div>
                              {truncated && (
                                <div className="text-gray-400 text-sm mt-1">...</div>
                              )}
                            </>
                          )
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

                     {/* 7. Сумма чаевых, крупно, по центру, доступная для редактирования */}
           <div className="text-center mb-6">
             <label className="block text-sm font-semibold text-gray-700 mb-3">Сумма чаевых</label>
             <div className="relative inline-block">
               {!isEditingTip ? (
                 <div 
                   className="flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-2 transition-colors"
                   onClick={() => setIsEditingTip(true)}
                 >
                   <AnimatedCounter 
                     value={tipAmount}
                     duration={600}
                     className="text-4xl font-bold text-center text-gray-900"
                   />
                   <span className="text-4xl font-bold text-gray-900 ml-1">₽</span>
                 </div>
               ) : (
                 <div className="flex items-center justify-center">
                   <input
                     type="number"
                     value={tipAmount}
                     onChange={(e) => handleTipAmountChange(Number(e.target.value))}
                     onBlur={() => setIsEditingTip(false)}
                     onKeyDown={(e) => e.key === 'Enter' && setIsEditingTip(false)}
                     className="text-4xl font-bold text-center text-gray-900 bg-transparent border-none outline-none px-2 py-2 transition-all duration-200 min-w-[8rem] w-auto focus:ring-2 focus:ring-emerald-500/20 rounded-lg"
                     placeholder="0"
                     style={{ width: `${Math.max(8, (tipAmount.toString().length + 3) * 1.5)}rem` }}
                     autoFocus
                   />
                   <span className="text-4xl font-bold text-gray-900 ml-1">₽</span>
                 </div>
               )}
               <div className="w-full h-0.5 bg-gray-300 mt-1"></div>
             </div>
           </div>

          {/* 8. Быстрый выбор из 5%, 10%, 15%, 20% с автоподстановкой суммы */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Быстрый выбор</label>
                             <div className="grid grid-cols-4 gap-3">
                   {percentageOptions.map((percentage) => (
                     <button
                       key={percentage}
                       onClick={() => handlePercentageSelect(percentage)}
                                               className={`p-3 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                          tipPercentage === percentage
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-500/20'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
                        }`}
                     >
                       <div className="text-lg font-bold">{percentage}%</div>
                     </button>
                   ))}
                 </div>
          </div>

          {/* 9. Галка согласия на оплату комиссии сервиса за официанта, 6%, по умолчанию включена */}
          <div className="mb-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={payCommission}
                  onChange={(e) => setPayCommission(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center ${
                  payCommission 
                    ? 'border-emerald-500 bg-emerald-500' 
                    : 'border-gray-300 bg-white'
                }`}>
                  {payCommission && (
                    <svg className="w-4 h-4 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-700">
                <span className="font-medium">Оплатить комиссию сервиса</span>
                <span className="text-gray-500 ml-1">(6% от суммы чаевых)</span>
              </div>
            </label>
          </div>

          {/* 10. Галка согласия с офертой, по умолчанию выключена */}
          <div className="mb-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center ${
                  agreeToTerms 
                    ? 'border-emerald-500 bg-emerald-500' 
                    : 'border-gray-300 bg-white'
                }`}>
                  {agreeToTerms && (
                    <svg className="w-4 h-4 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-700">
                <span>Я согласен с </span>
                <a href="#" className="text-emerald-600 hover:underline">условиями использования</a>
                <span> и </span>
                <a href="#" className="text-emerald-600 hover:underline">политикой конфиденциальности</a>
              </div>
            </label>
          </div>

          {/* 11. Выбор способа оплаты (СБП) */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Способ оплаты</label>
            <div className="border-2 border-emerald-500 rounded-xl p-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center">
                  <Image src={getStaticAssetPath('/sbp-logo.png')} alt="СБП" width={32} height={32} className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">СБП</div>
                  <div className="text-sm text-gray-600">Система быстрых платежей</div>
                </div>
              </div>
            </div>
          </div>

          {/* 12. Кнопка оплаты */}
          <button
            onClick={handleSubmit}
            disabled={!agreeToTerms}
                         className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] ${
               agreeToTerms
                 ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30'
                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'
             }`}
          >
            Оплатить {totalAmount} ₽
          </button>


        </div>
      </div>
    </div>
  )
}