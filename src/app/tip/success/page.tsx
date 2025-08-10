import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm text-center">
          {/* Иконка успеха */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          {/* Заголовок */}
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Чаевые успешно отправлены!
          </h1>
          
          {/* Описание */}
          <p className="text-gray-600 mb-6 text-sm">
            Спасибо за ваш отзыв и чаевые. Они будут переданы официанту в ближайшее время.
          </p>
          
          {/* Дополнительная информация */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Сумма чаевых: <span className="font-medium text-gray-900">500 ₽</span></p>
              <p>• Комиссия сервиса: <span className="font-medium text-gray-900">30 ₽</span></p>
              <p>• Итого к оплате: <span className="font-medium text-gray-900">530 ₽</span></p>
            </div>
          </div>
          
          {/* Кнопка закрытия */}
          <Link
            href="/"
            className="inline-block px-6 py-3 gm-btn gm-btn-primary"
          >
            Закрыть
          </Link>
        </div>
      </div>
    </div>
  )
}