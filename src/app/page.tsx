'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="container py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">
          GuestMe Tips - Система чаевых
        </h1>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Сценарии оплаты чаевых
            </h2>

            <div className="space-y-3">
              <p className="text-neutral-600 text-sm">
                Выберите один из вариантов для тестирования:
              </p>

              <div className="grid grid-cols-1 gap-3">
                <Link href="/tip?code=TEST001&sig=test_signature&ts=1734567890">
                  <button className="block w-full p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-left">
                    <div className="font-medium text-neutral-900">Оплата официанту</div>
                    <div className="text-sm text-neutral-600">Индивидуальные чаевые для конкретного официанта</div>
                  </button>
                </Link>

                <Link href="/team-tip?code=TEAM001&sig=test_signature&ts=1734567890">
                  <button className="block w-full p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-left">
                    <div className="font-medium text-neutral-900">Оплата команде</div>
                    <div className="text-sm text-neutral-600">Чаевые для всей команды ресторана</div>
                  </button>
                </Link>

                <Link href="/team-mvp?code=TEAM002&sig=test_signature&ts=1734567890">
                  <button className="block w-full p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-left">
                    <div className="font-medium text-neutral-900">Оплата команде (MVP)</div>
                    <div className="text-sm text-neutral-600">Упрощенная версия для команды</div>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Административные функции
            </h2>

            <div className="space-y-3">
              <p className="text-neutral-600 text-sm">
                Доступ к административным функциям:
              </p>

              <div className="grid grid-cols-1 gap-3">
                <Link href="/connect">
                  <button className="block w-full p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-left">
                    <div className="font-medium text-neutral-900">Подключение официанта</div>
                    <div className="text-sm text-neutral-600">Добавление нового официанта в систему</div>
                  </button>
                </Link>

                <Link href="/waiter/ALEX001">
                  <button className="block w-full p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-left">
                    <div className="font-medium text-neutral-900">Личная страница официанта</div>
                    <div className="text-sm text-neutral-600">Просмотр и управление профилем официанта</div>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}