'use client'

import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  y: number
  size: number
  color: string
  rotation: number
  speed: number
  delay: number
}

const colors = [
  '#FF6B6B', // красный
  '#4ECDC4', // бирюзовый
  '#45B7D1', // голубой
  '#96CEB4', // зеленый
  '#FFEAA7', // желтый
  '#DDA0DD', // фиолетовый
  '#FFB6C1', // розовый
  '#98D8C8', // мятный
  '#F7DC6F', // золотой
  '#BB8FCE'  // лавандовый
]

export default function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    // Создаем 50 частиц конфети
    const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // позиция по X в процентах
      y: -10 - Math.random() * 20, // начинаем выше экрана
      size: 8 + Math.random() * 12, // размер от 8 до 20px
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360, // случайный поворот
      speed: 0.5 + Math.random() * 1.5, // скорость падения
      delay: Math.random() * 2000 // случайная задержка до 2 секунд
    }))

    setPieces(newPieces)

    // Анимация падения
    const animationInterval = setInterval(() => {
      setPieces(prevPieces => 
        prevPieces.map(piece => ({
          ...piece,
          y: piece.y + piece.speed,
          rotation: piece.rotation + 2, // вращение при падении
          x: piece.x + (Math.random() - 0.5) * 0.5 // небольшое покачивание влево-вправо
        }))
      )
    }, 50)

    // Очистка интервала через 8 секунд
    const cleanupTimeout = setTimeout(() => {
      clearInterval(animationInterval)
    }, 8000)

    return () => {
      clearInterval(animationInterval)
      clearTimeout(cleanupTimeout)
    }
  }, [])

  // Удаляем частицы, которые упали ниже экрана
  const visiblePieces = pieces.filter(piece => piece.y < 110)

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {visiblePieces.map(piece => (
        <div
          key={piece.id}
          className="absolute animate-bounce"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            animationDelay: `${piece.delay}ms`,
            animationDuration: `${2 + Math.random() * 2}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%', // случайная форма
            boxShadow: `0 0 ${piece.size / 2}px ${piece.color}80`
          }}
        />
      ))}
    </div>
  )
}
