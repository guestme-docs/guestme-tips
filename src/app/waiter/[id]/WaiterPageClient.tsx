'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { BarChart3, Wallet, User, Home } from 'lucide-react'

interface WaiterProfile {
  id: string
  name: string
  surname: string
  phone: string
  photo?: string
  goal: string
  goalAmount: number
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<'dashboard' | 'tips' | 'profile'>('dashboard')
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('all')
  const [period, setPeriod] = useState('all')
  const [isEditingName, setIsEditingName] = useState(false)
  
  const [profile, setProfile] = useState<WaiterProfile>({
    id: waiterId,
    name: 'Алексей',
    surname: 'Иванов',
    phone: '+7 999 123 45 67',
    goal: 'Накопить на отпуск',
    goalAmount: 50000,
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
      date: '2025-08-11 20:15',
      amount: 2000,
      restaurantName: 'Стейк-хаус BigFood на Пушечной, 61'
    },
    {
      id: '2',
      comment: 'Очень вкусно',
      rating: 4,
      date: '2025-08-10 19:30',
      amount: 1500,
      restaurantName: 'Ресторан "У моря"'
    },
    {
      id: '3',
      comment: 'Быстро и качественно',
      rating: 5,
      date: '2025-08-09 18:45',
      amount: 3000,
      restaurantName: 'Стейк-хаус BigFood на Пушечной, 61'
    },
    {
      id: '4',
      comment: 'Превосходное обслуживание',
      rating: 5,
      date: '2025-08-08 21:00',
      amount: 2500,
      restaurantName: 'Стейк-хаус BigFood на Пушечной, 61'
    },
    {
      id: '5',
      comment: 'Вежливый персонал',
      rating: 4,
      date: '2025-08-07 20:30',
      amount: 1800,
      restaurantName: 'Ресторан "У моря"'
    },
    {
      id: '6',
      comment: 'Отличная атмосфера',
      rating: 5,
      date: '2025-08-06 19:15',
      amount: 2200,
      restaurantName: 'Стейк-хаус BigFood на Пушечной, 61'
    },
    {
      id: '7',
      comment: 'Быстрое обслуживание',
      rating: 4,
      date: '2025-08-05 18:00',
      amount: 1600,
      restaurantName: 'Ресторан "У моря"'
    },
    {
      id: '8',
      comment: 'Профессиональный подход',
      rating: 5,
      date: '2025-08-04 20:45',
      amount: 2800,
      restaurantName: 'Стейк-хаус BigFood на Пушечной, 61'
    }
  ])

  // Заглушка для авторизации
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (phone) {
      setAuthStep('code')
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

  const handleNameEdit = () => {
    setIsEditingName(true)
  }

  const handleNameSave = () => {
    setIsEditingName(false)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fullName = e.target.value.trim()
    const nameParts = fullName.split(' ').filter(part => part.length > 0)
    const name = nameParts[0] || ''
    const surname = nameParts.slice(1).join(' ') || ''
    setProfile(prev => ({ ...prev, name, surname }))
  }

  const handleCardUpdate = (cardNumber: string) => {
    setProfile(prev => ({ ...prev, cardNumber, status: 'active' }))
  }

  const handleCardDelete = () => {
    setProfile(prev => ({ ...prev, cardNumber: undefined }))
  }

  const handleRestaurantDelete = (restaurantId: string) => {
    setProfile(prev => ({
      ...prev,
      restaurants: prev.restaurants.filter(r => r.id !== restaurantId)
    }))
  }

  const handleGoHome = () => {
    router.push('/')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const navigateToSection = (section: typeof activeSection) => {
    setActiveSection(section)
    closeMenu()
  }

  // Функция для получения имени пользователя для приветствия
  const getWelcomeUsername = () => {
    const fullName = `${profile.name} ${profile.surname}`.trim()
    if (!fullName) return 'Гость'
    
    const nameParts = fullName.split(' ')
    return nameParts[0] || 'Гость'
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#6AE8C5]/10 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#6AE8C5] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-neutral-900 font-inter-display">Личный кабинет</h1>
            <p className="text-neutral-600 mt-2 text-sm">Войдите в систему для доступа к настройкам</p>
          </div>

          {authStep === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Номер телефона
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 999 123 45 67"
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6AE8C5] focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#6AE8C5] text-neutral-900 py-3 px-4 rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                Получить код
              </button>
            </form>
          ) : (
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Код подтверждения
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="1234"
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6AE8C5] focus:border-transparent"
                  required
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Код отправлен на номер {phone}. Действует 5 минут.
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-[#6AE8C5] text-neutral-900 py-3 px-4 rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                Войти
              </button>
              <button
                type="button"
                onClick={() => setAuthStep('phone')}
                className="w-full bg-neutral-100 text-neutral-700 py-3 px-4 rounded-xl font-medium hover:bg-neutral-200 transition-colors"
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
    <div className="min-h-screen bg-neutral-50 mx-auto relative" style={{ maxWidth: '414px' }}>
      {/* Мобильный хедер */}
      <div className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-semibold text-neutral-900 font-inter-display">Личный кабинет</h1>
              <p className="text-sm text-neutral-600">{profile.name} {profile.surname}</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Бургер-меню */}
      {isMenuOpen && (
        <div className="absolute inset-0 z-50 bg-black bg-opacity-30" onClick={closeMenu}>
          <div className="absolute left-0 top-0 h-full w-4/5 max-w-80 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-[#6AE8C5] rounded-full flex items-center justify-center">
                  {profile.photo ? (
                    <Image src={profile.photo} alt="" width={48} height={48} className="w-12 h-12 object-cover rounded-full" />
                  ) : (
                    <span className="text-neutral-900 font-semibold text-lg">
                      {profile.name[0]}{profile.surname[0]}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 font-inter-display">{profile.name} {profile.surname}</h3>
                  <p className="text-sm text-neutral-600">ID: {profile.id}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                <button
                  onClick={() => navigateToSection('dashboard')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
                    activeSection === 'dashboard' 
                      ? 'bg-[#6AE8C5] text-neutral-900' 
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <BarChart3 size={20} className={activeSection === 'dashboard' ? 'text-neutral-900' : 'text-neutral-600'} />
                    <span>Дашборд</span>
                  </div>
                </button>
                <button
                  onClick={() => navigateToSection('tips')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
                    activeSection === 'tips' 
                      ? 'bg-[#6AE8C5] text-neutral-900' 
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Wallet size={20} className={activeSection === 'tips' ? 'text-neutral-900' : 'text-neutral-600'} />
                    <span>Статистика</span>
                  </div>
                </button>
                <button
                  onClick={() => navigateToSection('profile')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
                    activeSection === 'profile' 
                      ? 'bg-[#6AE8C5] text-neutral-900' 
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <User size={20} className={activeSection === 'profile' ? 'text-neutral-900' : 'text-neutral-600'} />
                    <span>Профиль</span>
                  </div>
                </button>

              </nav>

              <div className="mt-8 pt-6 border-t border-neutral-200">
                <button
                  onClick={handleGoHome}
                  className="w-full text-left px-4 py-3 rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Home size={20} className="text-neutral-600" />
                    <span>На главную</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Основной контент */}
      <div className="p-4">
        {activeSection === 'dashboard' && (
          <div className="space-y-4">
            {/* Приветствие */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-neutral-900 font-inter-display mb-4">Добро пожаловать, {getWelcomeUsername()}!</h2>
              
              {/* Рейтинг */}
              <div className="mb-4">
                <div className="text-sm text-neutral-600 mb-2">Ваш рейтинг</div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-neutral-900">4.8</span>
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i}>{i < 5 ? '★' : '☆'}</span>
                    ))}
                  </div>
                  <span className="text-sm text-neutral-500">(24 отзыва)</span>
                </div>
              </div>
              
              {/* Прогресс цели */}
              <div>
                <div className="text-sm text-neutral-600 mb-2">Прогресс цели</div>
                <div className="mb-2">
                  <div className="text-lg font-semibold text-neutral-900">₽{tips.reduce((sum, tip) => sum + tip.amount, 0).toLocaleString()} из ₽{profile.goalAmount.toLocaleString()}</div>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-3">
                  <div 
                    className="bg-[#6AE8C5] h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min((tips.reduce((sum, tip) => sum + tip.amount, 0) / profile.goalAmount) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigateToSection('tips')}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="text-2xl font-bold text-neutral-900">
                  ₽ {tips.reduce((sum, tip) => sum + tip.amount, 0).toLocaleString()}
                </div>
                <div className="text-sm text-neutral-600">Всего чаевых</div>
              </button>
              <button 
                onClick={() => navigateToSection('tips')}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="text-2xl font-bold text-neutral-900">
                  {tips.length}
                </div>
                <div className="text-sm text-neutral-600">Количество</div>
              </button>
            </div>

            {/* Последние чаевые */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-neutral-900 mb-3 font-inter-display">Последние чаевые</h3>
              <div className="space-y-3">
                {tips.slice(0, 5).map((tip) => (
                  <div key={tip.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                    <div className="flex-1">
                      <div className="font-medium text-neutral-900">₽ {tip.amount.toLocaleString()}</div>
                      <div className="text-sm text-neutral-600">{tip.restaurantName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-neutral-500">{tip.date.split(' ')[0]}</div>
                      {tip.rating && (
                        <div className="flex text-yellow-400 text-sm">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i}>{i < tip.rating! ? '★' : '☆'}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'tips' && (
          <div className="space-y-4">
            {/* Верхний блок: Фильтры и статистика */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-neutral-900 mb-3 font-inter-display">Статистика</h3>
              
              {/* Фильтры без лейблов */}
              <div className="flex flex-col items-center gap-3 mb-4 p-3 bg-neutral-50 rounded-lg">
                {profile.restaurants.length > 1 && (
                  <select
                    value={selectedRestaurant}
                    onChange={(e) => setSelectedRestaurant(e.target.value)}
                    className="w-full max-w-xs px-3 pr-8 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6AE8C5] focus:border-[#6AE8C5] bg-white text-center truncate"
                  >
                    <option value="all">Все рестораны</option>
                    {profile.restaurants.map(restaurant => (
                      <option key={restaurant.id} value={restaurant.id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>
                )}
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full max-w-xs px-3 pr-8 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6AE8C5] focus:border-[#6AE8C5] bg-white text-center truncate"
                >
                  <option value="all">Все время</option>
                  <option value="today">Сегодня</option>
                  <option value="yesterday">Вчера</option>
                  <option value="week">Неделя</option>
                  <option value="month">Месяц</option>
                </select>
              </div>

              {/* Статистика за период */}
              {(() => {
                const filteredTips = tips
                  .filter(tip => {
                    if (selectedRestaurant === 'all') return true
                    const restaurant = profile.restaurants.find(r => r.id === selectedRestaurant)
                    return restaurant && tip.restaurantName === restaurant.name
                  })
                  .filter(tip => {
                    if (period === 'all') return true;
                    
                    const tipDate = new Date(tip.date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const tipDateOnly = new Date(tip.date);
                    tipDateOnly.setHours(0, 0, 0, 0);

                    if (period === 'today') {
                      return tipDateOnly >= today;
                    } else if (period === 'yesterday') {
                      const yesterday = new Date(today);
                      yesterday.setDate(today.getDate() - 1);
                      return tipDateOnly >= yesterday && tipDateOnly < today;
                    } else if (period === 'week') {
                      const sevenDaysAgo = new Date(today);
                      sevenDaysAgo.setDate(today.getDate() - 7);
                      return tipDateOnly >= sevenDaysAgo;
                    } else if (period === 'month') {
                      const thirtyDaysAgo = new Date(today);
                      thirtyDaysAgo.setDate(today.getDate() - 30);
                      return tipDateOnly >= thirtyDaysAgo;
                    }
                    return true;
                  });

                const totalAmount = filteredTips.reduce((sum, tip) => sum + tip.amount, 0);
                const averageAmount = filteredTips.length > 0 ? totalAmount / filteredTips.length : 0;

                return (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-neutral-50 rounded-lg">
                      <div className="text-lg font-semibold text-neutral-900">₽ {totalAmount.toLocaleString()}</div>
                      <div className="text-sm text-neutral-600">Сумма за период</div>
                    </div>
                    <div className="text-center p-3 bg-neutral-50 rounded-lg">
                      <div className="text-lg font-semibold text-neutral-900">₽ {Math.round(averageAmount).toLocaleString()}</div>
                      <div className="text-sm text-neutral-600">Средняя сумма</div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Нижний блок: Список чаевых */}
            <div className="space-y-3">
              {(() => {
                const filteredTips = tips
                  .filter(tip => {
                    if (selectedRestaurant === 'all') return true
                    const restaurant = profile.restaurants.find(r => r.id === selectedRestaurant)
                    return restaurant && tip.restaurantName === restaurant.name
                  })
                  .filter(tip => {
                    if (period === 'all') return true;
                    
                    const tipDate = new Date(tip.date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const tipDateOnly = new Date(tip.date);
                    tipDateOnly.setHours(0, 0, 0, 0);

                    if (period === 'today') {
                      return tipDateOnly >= today;
                    } else if (period === 'yesterday') {
                      const yesterday = new Date(today);
                      yesterday.setDate(today.getDate() - 1);
                      return tipDateOnly >= yesterday && tipDateOnly < today;
                    } else if (period === 'week') {
                      const sevenDaysAgo = new Date(today);
                      sevenDaysAgo.setDate(today.getDate() - 7);
                      return tipDateOnly >= sevenDaysAgo;
                    } else if (period === 'month') {
                      const thirtyDaysAgo = new Date(today);
                      thirtyDaysAgo.setDate(today.getDate() - 30);
                      return tipDateOnly >= thirtyDaysAgo;
                    }
                    return true;
                  });
                
                return filteredTips.map((tip) => (
                  <div key={tip.id} className="p-4 border border-neutral-200 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-lg font-semibold text-neutral-900">₽ {tip.amount.toLocaleString()}</div>
                      <div className="text-sm text-neutral-500">{tip.date}</div>
                    </div>
                    <div className="text-sm text-neutral-600 mb-2">{tip.restaurantName}</div>
                    {tip.comment && (
                      <div className="text-sm text-neutral-700 bg-neutral-50 p-3 rounded-lg">
                        "{tip.comment}"
                      </div>
                    )}
                    {tip.rating && (
                      <div className="flex text-yellow-400 mt-2">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i}>{i < tip.rating! ? '★' : '☆'}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ));
              })()}
            </div>
          </div>
        )}

        {activeSection === 'profile' && (
          <div className="space-y-4">
            {/* Фото профиля и личные данные */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              {/* Скрытый input для загрузки фото */}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              
              <div className="flex items-center space-x-4">
                <div 
                  className="w-20 h-20 bg-neutral-200 rounded-full flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                >
                  {profile.photo ? (
                    <Image src={profile.photo} alt="" width={80} height={80} className="w-20 h-20 object-cover" />
                  ) : (
                    <span className="text-neutral-500 text-2xl font-semibold">
                      {profile.name[0]}{profile.surname[0]}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 flex items-center space-x-3 min-w-0">
                  {isEditingName ? (
                    <div className="flex-1 flex items-center space-x-2 min-w-0">
                      <input
                        type="text"
                        value={`${profile.name} ${profile.surname}`.trim()}
                        onChange={handleNameChange}
                        className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6AE8C5] focus:border-transparent min-w-0"
                        placeholder="Имя Фамилия"
                        autoFocus
                      />
                      <button
                        onClick={handleNameSave}
                        className="p-2 text-[#6AE8C5] hover:bg-[#6AE8C5]/10 rounded-lg transition-colors flex-shrink-0"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center space-x-2 min-w-0">
                      <span className="text-lg font-medium text-neutral-900 truncate">
                        {profile.name} {profile.surname}
                      </span>
                      <button
                        onClick={handleNameEdit}
                        className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors flex-shrink-0"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Цель */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-900 mb-4 font-inter-display">Цель сбора чаевых</h3>
              <textarea
                value={profile.goal}
                onChange={(e) => setProfile(prev => ({ ...prev, goal: e.target.value }))}
                rows={3}
                maxLength={200}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6AE8C5] focus:border-transparent mb-4"
                placeholder="Опишите, на что вы копите чаевые..."
              />
              <p className="text-xs text-neutral-500 mb-4 text-right">
                {profile.goal.length}/200 символов
              </p>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Сумма цели (₽)
                </label>
                <input
                  type="number"
                  value={profile.goalAmount}
                  onChange={(e) => setProfile(prev => ({ ...prev, goalAmount: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6AE8C5] focus:border-transparent"
                  placeholder="50000"
                  min="0"
                />
              </div>
            </div>

            {/* Банковская карта */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-900 mb-4 font-inter-display">Банковская карта</h3>
              {profile.cardNumber ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-neutral-100 to-neutral-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-neutral-700">
                        **** **** **** {profile.cardNumber.slice(-4)}
                      </span>
                      <div className="w-8 h-8 bg-[#6AE8C5] rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCardUpdate('')}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                      Обновить
                    </button>
                    <button
                      onClick={handleCardDelete}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6AE8C5] focus:border-transparent"
                    maxLength={19}
                  />
                  <button
                    onClick={() => handleCardUpdate('1234567890123456')}
                    className="w-full px-4 py-3 bg-[#6AE8C5] text-neutral-900 rounded-xl font-medium hover:opacity-90 transition-opacity"
                  >
                    Добавить карту
                  </button>
                </div>
              )}
            </div>

            {/* Информация о ресторанах */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-900 mb-4 font-inter-display">Мои рестораны</h3>
              <div className="space-y-3">
                {profile.restaurants.map((restaurant) => (
                  <div key={restaurant.id} className="p-4 border border-neutral-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-neutral-900">{restaurant.name}</div>
                        <div className="text-sm text-neutral-600">ID: {restaurant.id}</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          restaurant.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {restaurant.status === 'active' ? 'Активен' : 'Неактивен'}
                        </div>
                        <button
                          onClick={() => handleRestaurantDelete(restaurant.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Удалить ресторан"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

