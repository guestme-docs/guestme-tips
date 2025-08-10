'use client'

import { useEffect, useState } from 'react'

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
}

export default function AnimatedCounter({ value, duration = 800, className = '' }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (displayValue === value) return

    setIsAnimating(true)
    
    const startValue = displayValue
    const endValue = value
    const difference = endValue - startValue
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Функция плавности (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      const currentValue = Math.round(startValue + (difference * easeOut))
      setDisplayValue(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(endValue)
        setIsAnimating(false)
      }
    }
    
    requestAnimationFrame(animate)
  }, [value, duration, displayValue])

  return (
    <span 
      className={`transition-all duration-200 ${isAnimating ? 'scale-110 text-emerald-600' : 'scale-100'} ${className}`}
    >
      {displayValue.toLocaleString('ru-RU')}
    </span>
  )
}
