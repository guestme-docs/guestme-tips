import { NextResponse } from "next/server"
import { readJson, writeJson } from "../../../lib/storage"

export const dynamic = 'force-static'

type Tip = { 
  id: string
  code: string
  amount: number
  rating: number
  comment?: string
  recipientType: 'waiter' | 'team'
  waiterId?: string
  waiterName?: string
  restaurantName?: string
  createdAt: string
}

// Функция для проверки подписи и временной метки
function validateSignature(sig: string, ts: number): boolean {
  const currentTime = Math.floor(Date.now() / 1000)
  const timeDiff = currentTime - ts
  
  // Проверяем, что временная метка не старше 24 часов
  if (timeDiff > 24 * 60 * 60) {
    return false
  }
  
  // TODO: Здесь должна быть реальная проверка подписи
  // Пока просто проверяем, что подпись не пустая
  // Для тестовых данных разрешаем любую непустую подпись
  return Boolean(sig && sig.length > 0)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      code, 
      amount, 
      rating, 
      comment, 
      recipientType, 
      waiterId, 
      waiterName, 
      restaurantName 
    } = body

    // Валидация данных
    if (!code || !amount || !rating || !recipientType) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Не все обязательные поля заполнены' 
      }, { status: 400 })
    }

    if (amount <= 0 || rating < 1 || rating > 5) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Некорректные данные' 
      }, { status: 400 })
    }

    // Создание нового чаевых
    const id = Math.random().toString(36).slice(2)
    const tip: Tip = { 
      id, 
      code, 
      amount, 
      rating, 
      comment, 
      recipientType, 
      waiterId, 
      waiterName, 
      restaurantName,
      createdAt: new Date().toISOString() 
    }

    // Чтение существующих чаевых
    const tips = await readJson<Tip[]>("src/data/tips.json", [])
    tips.push(tip)
    
    // Сохранение обновленных данных
    await writeJson("src/data/tips.json", tips)

    // Возврат успешного ответа
    return NextResponse.json({ 
      ok: true, 
      tipId: id,
      redirectUrl: `/tip/success?tipId=${id}`
    })

  } catch (error) {
    console.error('Error processing tip:', error)
    return NextResponse.json({ 
      ok: false, 
      error: 'Внутренняя ошибка сервера' 
    }, { status: 500 })
  }
}

// GET метод для получения информации о заказе по коду
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    const sig = searchParams.get('sig')
    const ts = searchParams.get('ts')
    
    if (!code) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Код заказа не указан' 
      }, { status: 400 })
    }

    // Проверяем подпись и временную метку
    // Для тестовых кодов пропускаем валидацию
    if (code.startsWith('TEST') || code.startsWith('ORDER')) {
      console.log(`Пропускаем валидацию для тестового кода: ${code}`)
    } else if (sig && ts) {
      const timestamp = parseInt(ts)
      if (!validateSignature(sig, timestamp)) {
        return NextResponse.json({ 
          ok: false, 
          error: 'Ссылка недействительна или устарела' 
        }, { status: 400 })
      }
    }

    // Получаем данные заказа
    const orderData = await getOrderData(code)
    if (!orderData) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Заказ не найден' 
      }, { status: 404 })
    }

    console.log(`Получены данные заказа для кода ${code}:`, orderData)

    // Получаем данные о получателе
    const recipientData = await getRecipientData(orderData.waiterId)
    console.log(`Получены данные получателя:`, recipientData)
    
    return NextResponse.json({ 
      ok: true, 
      orderData: {
        ...orderData,
        recipient: recipientData
      }
    })

  } catch (error) {
    console.error('Error fetching order data:', error)
    return NextResponse.json({ 
      ok: false, 
      error: 'Внутренняя ошибка сервера' 
    }, { status: 500 })
  }
}

// Функция получения данных заказа
async function getOrderData(code: string) {
  // TODO: Здесь должна быть реальная интеграция с iiko
  // Пока возвращаем мок-данные в зависимости от кода
  
  // Базовые данные заказа
  const baseOrder = {
    restaurant: 'Ресторан "У Моря"',
    orderNumber: code,
    orderDate: new Date().toISOString(),
    tableNumber: '15',
    items: [
      { name: 'Стейк из говядины', quantity: 1, price: 1800 },
      { name: 'Картофель по-деревенски', quantity: 1, price: 400 },
      { name: 'Салат Цезарь', quantity: 1, price: 300 }
    ]
  }
  
  // Разные данные для разных тестовых сценариев
  if (code === 'TEST001') {
    return {
      ...baseOrder,
      waiter: 'Алексей Петров',
      waiterId: 'ALEX001',
      orderAmount: 2500
    }
  } else if (code === 'TEST002') {
    return {
      ...baseOrder,
      waiter: 'Михаил Сидоров',
      waiterId: 'MIKHAIL003',
      orderAmount: 3200
    }
  } else if (code === 'TEST003') {
    return {
      ...baseOrder,
      waiter: 'Анна Иванова',
      waiterId: 'ANNA002',
      orderAmount: 1800
    }
  } else {
    // Для остальных кодов (включая ORDER123)
    return {
      ...baseOrder,
      waiter: 'Алексей Петров',
      waiterId: 'ALEX001',
      orderAmount: 2500
    }
  }
}

// Функция получения данных о получателе
async function getRecipientData(waiterId: string) {
  try {
    // Читаем данные о сотрудниках
    const employees = await readJson<Array<{
      id: string
      name: string
      surname: string
      phone: string
      status: string
      photo?: string
      goal: string
    }>>("src/data/employees.json", [])
    const employee = employees.find(emp => emp.id === waiterId)
    
    if (employee && employee.status === 'active') {
      // Активный сотрудник
      return {
        type: 'waiter',
        id: employee.id,
        name: employee.name,
        surname: employee.surname,
        photo: employee.photo,
        goal: employee.goal,
        status: 'active'
      }
    } else {
      // Если сотрудник не найден или неактивен, возвращаем команду
      return {
        type: 'team',
        name: 'Команда ресторана',
        goal: 'Улучшение сервиса и качества обслуживания',
        status: 'active'
      }
    }
  } catch (error) {
    console.error('Error reading employee data:', error)
    // В случае ошибки возвращаем команду
    return {
      type: 'team',
      name: 'Команда ресторана',
      goal: 'Улучшение сервиса и качества обслуживания',
      status: 'active'
    }
  }
}