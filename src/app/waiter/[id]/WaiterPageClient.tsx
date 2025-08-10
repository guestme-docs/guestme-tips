'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface WaiterProfile {
  id: string
  name: string
  surname: string
  phone: string
  photo?: string
  goal: string
  cardNumber?: string
  status: 'active' | 'inactive'
  restaurants: Array<{
    id: string
    name: string
    status: 'active' | 'inactive'
  }>
}

interface TipRecord {
  id: string
  comment?: string
  rating?: number
  date: string
  amount: number
  restaurantName: string
}

interface WaiterPageClientProps {
  waiterId: string
}

export default function WaiterPageClient({ waiterId }: WaiterPageClientProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authStep, setAuthStep] = useState<'phone' | 'code'>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [activeTab, setActiveTab] = useState<'settings' | 'statistics'>('settings')
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('all')
  const [period, setPeriod] = useState('week')
  
  const [profile, setProfile] = useState<WaiterProfile>({
    id: waiterId,
    name: 'Анна',
    surname: 'Иванова',
    phone: '+7 999 123 45 67',
    goal: 'Накопить на отпуск',
    status: 'active',
    restaurants: [
      { id: '1', name: 'Стейк-хаус BigFood на Пушечной, 61', status: 'active' },
      { id: '2', name: 'Ресторан "У моря"', status: 'active' }
    ]
  })

  const [tips] = useState<TipRecord[]>([
    {
      id: '1',
      comment: 'Отличный сервис!',
      rating: 5,
      date: '2024-07-10 20:15',
      amount: 2000,
      restaurantName: 'Стейк-хаус BigFood на Пушечной, 61'
    },
    {
      id: '2',
      comment: 'Очень вкусно',
      rating: 4,
      date: '2024-07-09 19:30',
      amount: 1500,
      restaurantName: 'Ресторан "У моря"'
    }
  ])

  // Заглушка для авторизации
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (phone) {
      setAuthStep('code')
      // В реальном приложении здесь отправляется SMS
      console.log('Отправка SMS на номер:', phone)
    }
  }

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code === '1234') { // Заглушка: код 1234
      setIsAuthenticated(true)
    } else {
      alert('Неверный код')
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, photo: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCardUpdate = (cardNumber: string) => {
    setProfile(prev => ({ ...prev, cardNumber, status: 'active' }))
  }

  const handleCardDelete = () => {
    setProfile(prev => ({ ...prev, cardNumber: undefined, status: 'inactive' }))
  }

  const handleGoHome = () => {
    try {
      router.push('/')
    } catch (error) {
      console.error('Ошибка навигации:', error)
      // Fallback: используем window.location
      window.location.href = '/'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Личный кабинет официанта</h1>
            <p className="text-gray-600 mt-2">Войдите в систему для доступа к настройкам</p>
          </div>

          {authStep === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Номер телефона
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 999 123 45 67"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors"
              >
                Получить код
              </button>
            </form>
          ) : (
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Код подтверждения
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="1234"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Код отправлен на номер {phone}. Действует 5 минут.
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors"
              >
                Войти
              </button>
              <button
                type="button"
                onClick={() => setAuthStep('phone')}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Изменить номер
              </button>
            </form>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGoHome}
                className="text-teal-600 hover:text-teal-700 text-sm hover:underline"
              >
                ← На главную
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Личный кабинет официанта
              </h1>
              <span className="text-sm text-gray-500">
                {profile.name} {profile.surname}
              </span>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Вкладки */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Настройки
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'statistics'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Статистика
            </button>
          </nav>
        </div>

        {/* Контент вкладок */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            {/* Фото */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Фото профиля</h3>
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {profile.photo ? (
                    <img src={profile.photo} alt="" className="w-24 h-24 object-cover" />
                  ) : (
                    <span className="text-gray-500 text-2xl">
                      {profile.name[0]}{profile.surname[0]}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  />
                  <p className="text-xs text-gray-500">
                    JPG/PNG до 5 МБ. Рекомендуемое соотношение 1:1
                  </p>
                </div>
              </div>
            </div>

            {/* Цель */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Цель сбора чаевых</h3>
              <div>
                <textarea
                  value={profile.goal}
                  onChange={(e) => setProfile(prev => ({ ...prev, goal: e.target.value }))}
                  rows={3}
                  maxLength={200}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Опишите, на что вы копите чаевые..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {profile.goal.length}/200 символов
                </p>
              </div>
            </div>

            {/* Банковская карта */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Банковская карта</h3>
              {profile.cardNumber ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 p-3 bg-gray-50 rounded-md">
                      <span className="font-mono text-gray-700">
                        **** **** **** {profile.cardNumber.slice(-4)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCardUpdate('')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Обновить
                    </button>
                    <button
                      onClick={handleCardDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Удалить
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Статус: <span className="text-green-600 font-medium">Активен</span>
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    maxLength={19}
                  />
                  <button
                    onClick={() => handleCardUpdate('1234567890123456')}
                    className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                  >
                    Добавить карту
                  </button>
                  <p className="text-sm text-gray-600">
                    Статус: <span className="text-red-600 font-medium">Не активен</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Статистика чаевых</h3>
            
            {/* Фильтры */}
            <div className="mb-6 flex space-x-4">
              {profile.restaurants.length > 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ресторан</label>
                  <select
                    value={selectedRestaurant}
                    onChange={(e) => setSelectedRestaurant(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="all">Все рестораны</option>
                    {profile.restaurants.map(restaurant => (
                      <option key={restaurant.id} value={restaurant.id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Период</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="today">Сегодня</option>
                  <option value="yesterday">Вчера</option>
                  <option value="week">Неделя</option>
                  <option value="month">Месяц</option>
                </select>
              </div>
            </div>

            {/* KPI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Сумма чаевых за период</div>
                <div className="text-2xl font-bold text-gray-900">
                  ₽ {tips.reduce((sum, tip) => sum + tip.amount, 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Средняя сумма чаевых</div>
                <div className="text-2xl font-bold text-gray-900">
                  ₽ {tips.length > 0 ? Math.round(tips.reduce((sum, tip) => sum + tip.amount, 0) / tips.length) : 0}
                </div>
              </div>
            </div>

            {/* Таблица */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Комментарий</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Оценка</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ресторан</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата/время</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сумма</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tips.map((tip) => (
                    <tr key={tip.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tip.comment || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tip.rating ? (
                          <div className="flex text-yellow-400">
                            {Array.from({ length: 5 }, (_, i) => (
                              <span key={i}>{i < tip.rating! ? '★' : '☆'}</span>
                            ))}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tip.restaurantName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tip.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₽ {tip.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

