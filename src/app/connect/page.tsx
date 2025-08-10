'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getStaticAssetPath } from '@/utils/paths'

interface Employee {
  id: string
  name: string
  surname: string
  phone?: string
  status: 'active' | 'inactive' | 'not_found'
  photo?: string
  goal?: string
}

interface TeamAccount {
  name: string
  phone: string
  status: 'active' | 'inactive'
  goal?: string
  photo?: string
}

export default function ConnectPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'tips' | 'settings' | 'statistics'>('tips')
  const [isModuleEnabled, setIsModuleEnabled] = useState(false)
  const [agreementAccepted, setAgreementAccepted] = useState(false)
  const [teamAccount, setTeamAccount] = useState<TeamAccount>({
    name: 'Команда ресторана',
    phone: '',
    status: 'inactive'
  })
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Анна',
      surname: 'Иванова',
      phone: '+7 999 123 45 67',
      status: 'active',
      goal: 'Накопить на отпуск'
    },
    {
      id: '2',
      name: 'Михаил',
      surname: 'Петров',
      phone: '+7 999 234 56 78',
      status: 'inactive',
      goal: 'Покупка автомобиля'
    }
  ])
  const [notificationEnabled, setNotificationEnabled] = useState(true)
  const [notificationText, setNotificationText] = useState('Спасибо, что были у нас в <название ресторана>! Оставьте отзыв и при желании чаевые: <ссылка чаевые>')

  const handleEnableModule = () => {
    if (agreementAccepted) {
      setIsModuleEnabled(true)
    }
  }

  const handleTeamAccountSubmit = () => {
    if (teamAccount.phone) {
      setTeamAccount(prev => ({ ...prev, status: 'active' }))
    }
  }

  const handleEmployeeInvite = (employeeId: string) => {
    // Логика отправки приглашения
    console.log('Отправка приглашения сотруднику:', employeeId)
  }

  const handleEmployeeDeactivate = (employeeId: string) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId ? { ...emp, status: 'inactive' } : emp
    ))
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Левое меню */}
      <div className="w-64 bg-gray-900 text-white">
        {/* Логотип */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-center">
            <Image src={getStaticAssetPath('/guestme-logo-white.svg')} alt="GuestMe" width={48} height={48} className="h-12 w-auto object-contain" />
          </div>
        </div>

        {/* Выбор ресторана */}
        <div className="p-4">
          <div className="bg-gray-800 rounded-lg p-3 cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-sm">Стейк-хаус BigFood на Пушечной, 61</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Навигация */}
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              <span>Дашборд</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
              </svg>
              <span>Резервы</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Схема зала</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Статистика</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>Интеграции</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-teal-600 cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Настройки</span>
            </div>
          </div>
        </nav>

        {/* Кнопка нового резерва */}
        <div className="px-4 mt-6">
          <button className="w-full bg-white text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Новый резерв
          </button>
        </div>

        {/* Нижние ссылки */}
        <div className="absolute bottom-0 left-0 w-64 p-4 space-y-2">
          <div className="text-sm text-gray-400 hover:text-white cursor-pointer">Личный кабинет</div>
          <div className="text-sm text-gray-400 hover:text-white cursor-pointer">Уведомления</div>
          <div className="text-sm text-gray-400 hover:text-white cursor-pointer">Помощь</div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Заголовок страницы */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Чаевые</h1>
            <button
              onClick={handleGoHome}
              className="text-teal-600 hover:text-teal-700 text-sm hover:underline"
            >
              ← На главную
            </button>
          </div>

          {/* Вкладки */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('tips')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tips'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Чаевые
              </button>
              {isModuleEnabled && (
                <>
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
                </>
              )}
            </nav>
          </div>

          {/* Контент вкладок */}
          {activeTab === 'tips' && (
            <div className="max-w-2xl">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Включение модуля чаевых</h2>
                <p className="text-gray-600 mb-6">
                  Модуль чаевых позволяет гостям оставлять чаевые сотрудникам и команде ресторана. 
                  Для активации необходимо принять условия оферты.
                </p>
                
                <div className="mb-6">
                  <a 
                    href="#" 
                    className="text-teal-600 hover:text-teal-700 underline"
                  >
                    Ознакомиться с офертой
                  </a>
                </div>

                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="agreement"
                    checked={agreementAccepted}
                    onChange={(e) => setAgreementAccepted(e.target.checked)}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <label htmlFor="agreement" className="ml-2 text-sm text-gray-700">
                    Согласен с офертой
                  </label>
                </div>

                <button
                  onClick={handleEnableModule}
                  disabled={!agreementAccepted}
                  className={`px-6 py-3 rounded-lg font-medium ${
                    agreementAccepted
                      ? 'bg-teal-600 text-white hover:bg-teal-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } transition-colors`}
                >
                  Включить
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && isModuleEnabled && (
            <div className="space-y-8">
              {/* Учётка команды ресторана */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Учётка команды ресторана</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Название</label>
                    <input
                      type="text"
                      value={teamAccount.name}
                      onChange={(e) => setTeamAccount(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Телефон *</label>
                    <input
                      type="tel"
                      value={teamAccount.phone}
                      onChange={(e) => setTeamAccount(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+7 999 123 45 67"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>
                <button
                  onClick={handleTeamAccountSubmit}
                  disabled={!teamAccount.phone}
                  className={`px-4 py-2 rounded-md font-medium ${
                    teamAccount.phone
                      ? 'bg-teal-600 text-white hover:bg-teal-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } transition-colors`}
                >
                  Отправить приглашение
                </button>
                {teamAccount.status === 'active' && (
                  <div className="mt-3 text-sm text-green-600">✓ Учётка команды активна</div>
                )}
              </div>

              {/* Уведомления после оплаты */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Уведомления после оплаты</h3>
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="notification"
                    checked={notificationEnabled}
                    onChange={(e) => setNotificationEnabled(e.target.checked)}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <label htmlFor="notification" className="ml-2 text-sm text-gray-700">
                    Включить отправку уведомлений
                  </label>
                </div>
                {notificationEnabled && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Доступные переменные: &lt;название ресторана&gt;, &lt;ссылка чаевые&gt;
                    </p>
                    <textarea
                      value={notificationText}
                      onChange={(e) => setNotificationText(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                )}
              </div>

              {/* Сотрудники */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Сотрудники</h3>
                <div className="space-y-4">
                  {employees.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          {employee.photo ? (
                            <Image src={employee.photo} alt="" width={48} height={48} className="w-12 h-12 rounded-full" />
                          ) : (
                            <span className="text-gray-500 text-lg">
                              {employee.name[0]}{employee.surname[0]}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {employee.name} {employee.surname}
                          </div>
                          <div className="text-sm text-gray-500">{employee.phone || 'Телефон не указан'}</div>
                          {employee.goal && (
                            <div className="text-sm text-gray-600">Цель: {employee.goal}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          employee.status === 'active' ? 'bg-green-100 text-green-800' :
                          employee.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {employee.status === 'active' ? 'Активен' :
                           employee.status === 'inactive' ? 'Неактивен' : 'Не найден в iiko'}
                        </span>
                        {employee.status === 'inactive' && (
                          <button
                            onClick={() => handleEmployeeInvite(employee.id)}
                            className="px-3 py-1 bg-teal-600 text-white text-sm rounded hover:bg-teal-700"
                          >
                            Пригласить
                          </button>
                        )}
                        {employee.status === 'active' && (
                          <button
                            onClick={() => handleEmployeeDeactivate(employee.id)}
                            className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                          >
                            Деактивировать
                          </button>
                        )}
                        <a
                          href={`/waiter/${employee.id}`}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          ЛК официанта
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'statistics' && isModuleEnabled && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика чаевых</h3>
              
              {/* Фильтры */}
              <div className="mb-6 flex space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Период</label>
                  <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Сегодня</option>
                    <option>Вчера</option>
                    <option>Неделя</option>
                    <option>Месяц</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Оценка</label>
                  <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Все</option>
                    <option>5 звезд</option>
                    <option>4 звезды</option>
                    <option>3 звезды</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Официант</label>
                  <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Все</option>
                    <option>Команда ресторана</option>
                    <option>Анна Иванова</option>
                    <option>Михаил Петров</option>
                  </select>
                </div>
              </div>

              {/* KPI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Сумма чаевых за период</div>
                  <div className="text-2xl font-bold text-gray-900">₽ 45,000</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Средняя сумма чаевых</div>
                  <div className="text-2xl font-bold text-gray-900">₽ 1,500</div>
                </div>
              </div>

              {/* Таблица */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Комментарий</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Оценка</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Гость</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Официант</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата/время</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сумма</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Отличный сервис!</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex text-yellow-400">★★★★★</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Иван Петров</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Анна Иванова</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10.07.2024 20:15</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₽ 2,000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex text-yellow-400">★★★★</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Команда ресторана</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10.07.2024 19:30</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₽ 1,500</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Баннер предупреждения */}
          {teamAccount.status !== 'active' && isModuleEnabled && (
            <div className="fixed bottom-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    Учётка команды не активна. Сервис чаевых не работает.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}