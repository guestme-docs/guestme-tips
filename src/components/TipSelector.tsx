'use client'

import { useState } from 'react'

interface TipSelectorProps {
  onAmountSelect: (amount: number) => void
  selectedAmount?: number
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
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-neutral-900">Выберите сумму чаевых</h3>
      
      <div className="grid grid-cols-3 gap-3">
        {presetAmounts.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => handlePresetSelect(amount)}
          className={`p-4 rounded-xl border-2 transition-all ${
              selectedAmount === amount && !isCustomSelected
                ? 'gm-border gm-bg-soft gm-text'
                : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            <div className="text-2xl font-bold">{amount}</div>
            <div className="text-sm text-neutral-600">₽</div>
          </button>
        ))}
      </div>

      <div className="relative">
        <label htmlFor="customAmount" className="block text-sm font-medium text-neutral-700 mb-2">
          Или введите свою сумму
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
            className={`w-full p-4 pr-12 rounded-xl border-2 transition-all ${
              isCustomSelected
                ? 'gm-border gm-bg-soft'
                : 'border-neutral-200 focus:border-[--gm-primary] focus:bg-white'
            }`}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500">₽</span>
        </div>
      </div>
    </div>
  )
}

