import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="container py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">
          GuestMe Tips - Система чаевых
        </h1>
        
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Тестирование системы чаевых
            </h2>
            
            <div className="space-y-3">
              <p className="text-neutral-600 text-sm">
                Выберите один из вариантов для тестирования:
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                <Link
                  href="/tip?code=TEST001&sig=test_signature&ts=1734567890"
                  className="block p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="font-medium text-neutral-900">Тест с активным официантом</div>
                  <div className="text-sm text-neutral-600">Код: TEST001, sig: test_signature, ts: 1734567890 (пропуск валидации)</div>
                </Link>
                
                <Link
                  href="/tip?code=TEST002&sig=test_signature"
                  className="block p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="font-medium text-neutral-900">Тест с неактивным официантом (команда)</div>
                  <div className="text-sm text-neutral-600">Код: TEST002, sig: test_signature (без timestamp - команда)</div>
                </Link>
                
                <Link
                  href="/tip?code=TEST003"
                  className="block p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="font-medium text-neutral-900">Тест без подписи</div>
                  <div className="text-sm text-neutral-600">Код: TEST003 (без sig и ts)</div>
                </Link>
                
                <Link
                  href="/tip"
                  className="block p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="font-medium text-neutral-900">Ввод кода вручную</div>
                  <div className="text-sm text-neutral-600">Страница для ввода кода заказа</div>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Административная панель
            </h2>
            
            <div className="space-y-3">
              <p className="text-neutral-600 text-sm">
                Управление системой чаевых:
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                <Link
                  href="/connect"
                  className="block p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="font-medium text-neutral-900">Настройки модуля чаевых</div>
                  <div className="text-sm text-neutral-600">Управление сотрудниками, командами и настройками</div>
                </Link>
                
                <Link
                  href="/waiter/ALEX001"
                  className="block p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="font-medium text-neutral-900">Личный кабинет официанта</div>
                  <div className="text-sm text-neutral-600">Профиль, статистика чаевых, настройки (ID: ALEX001)</div>
                </Link>
              </div>
            </div>
          </div>
          

        </div>
      </div>
    </main>
  )
}