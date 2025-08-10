'use client'

import { useState } from 'react'

interface TipSelectorProps {
  onAmountSelect: (amount: number) => void
  selectedAmount: number
}

export default function TipSelector({ onAmountSelect, selectedAmount }: TipSelectorProps) {
  const [customAmount, setCustomAmount] = useState('')
  const [isCustomSelected, setIsCustomSelected] = useState(false)

  const presetAmounts = [100, 200, 300, 500, 1000]

  const handlePresetSelect = (amount: number) => {
    setIsCustomSelected(false)
    setCustomAmount('')
    onAmountSelect(amount)
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    if (value && !isNaN(Number(value))) {
      setIsCustomSelected(true)
      onAmountSelect(Number(value))
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Выберите сумму чаевых</h3>
        <p className="text-gray-500 text-sm">Или введите свою сумму</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {presetAmounts.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => handlePresetSelect(amount)}
            className={`p-5 rounded-2xl border-2 transition-all duration-200 transform hover:scale-[1.02] ${
              selectedAmount === amount && !isCustomSelected
                ? 'border-blue-500 bg-blue-50/50 text-blue-700 shadow-md shadow-blue-500/20'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
            }`}
          >
            <div className="text-xl font-bold">{amount}</div>
            <div className="text-xs text-gray-500 mt-1">₽</div>
          </button>
        ))}
      </div>

      <div className="relative">
        <label htmlFor="customAmount" className="block text-sm font-semibold text-gray-700 mb-3">
          Своя сумма
        </label>
        <div className="relative">
          <input
            id="customAmount"
            type="number"
            min="10"
            step="10"
            value={customAmount}
            onChange={(e) => handleCustomAmountChange(e.target.value)}
            placeholder="Введите сумму"
            className={`w-full p-4 pr-12 rounded-xl border-2 transition-all duration-200 ${
              isCustomSelected
                ? 'border-blue-500 bg-blue-50/50 focus:ring-2 focus:ring-blue-500/20'
                : 'border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20'
            }`}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₽</span>
        </div>
      </div>
    </div>
  )
}

