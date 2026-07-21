'use client'

import { CloudPrice } from '../lib/types'
import { translateLocation, getLocationEmoji } from '../lib/locations'
import { 
  CpuChipIcon, 
  ServerStackIcon, 
  DocumentIcon,
  StarIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

interface PriceCardProps {
  price: CloudPrice
  rubRate: number
  showRub: boolean
  darkMode: boolean
  isFavorite: boolean
  onToggleFavorite: () => void
  onToggleComparison: () => void
  isInComparison: boolean
}

const providerColors: Record<string, string> = {
  DigitalOcean: 'bg-blue-500',
  AWS: 'bg-orange-500',
  Hetzner: 'bg-green-500',
  Vultr: 'bg-purple-500',
  Linode: 'bg-gray-500',
}

export function PriceCard({ 
  price, 
  rubRate, 
  showRub, 
  darkMode,
  isFavorite,
  onToggleFavorite,
  onToggleComparison,
  isInComparison
}: PriceCardProps) {
  const priceInRub = price.price * rubRate
  
  const getPriceCategory = (price: number) => {
    if (price < 10) return { 
      label: '💎 Экономный', 
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800'
    }
    if (price < 20) return { 
      label: '💰 Средний', 
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
    }
    return { 
      label: '🔥 Дорогой', 
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
    }
  }

  const category = getPriceCategory(price.price)
  const savings = price.price > 10 ? Math.round((price.price - 4.5) * 12) : 0
  
  const translatedLocation = translateLocation(price.region || 'unknown')
  const locationEmoji = getLocationEmoji(price.region || '')

  return (
    <div className={`group rounded-2xl p-6 border transition-all hover:shadow-xl hover:-translate-y-1 ${
      darkMode 
        ? 'bg-gray-800 border-gray-700 hover:border-blue-500' 
        : 'bg-white border-gray-100 shadow-sm hover:border-blue-300'
    }`}>
      {/* Header with actions */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${providerColors[price.provider] || 'bg-gray-500'} shadow-lg`}></div>
          <div>
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {price.name}
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {price.provider}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onToggleFavorite}
            className="p-1 hover:scale-110 transition-transform"
            title={isFavorite ? 'Убрать из избранного' : 'В избранное'}
          >
            {isFavorite ? (
              <StarSolidIcon className="w-5 h-5 text-yellow-500" />
            ) : (
              <StarIcon className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-300'}`} />
            )}
          </button>
          <button
            onClick={onToggleComparison}
            className={`p-1 rounded transition-all ${
              isInComparison 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={isInComparison ? 'Убрать из сравнения' : 'Добавить в сравнение'}
          >
            <ArrowsRightLeftIcon className={`w-5 h-5 ${
              isInComparison ? 'text-blue-600' : darkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {showRub ? `${Math.round(priceInRub)} ₽` : `${price.price} ${price.currency}`}
          </p>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            / месяц
          </p>
        </div>
        <div className={`text-xs px-2.5 py-1 rounded-lg font-medium ${category.color}`}>
          {category.label}
        </div>
      </div>

      {/* Savings */}
      {savings > 0 && (
        <div className="mt-2 text-sm bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-800 font-medium">
          💰 Экономия: ${savings}/год
        </div>
      )}

      {/* Specs */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className={`rounded-xl p-2.5 text-center ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <CpuChipIcon className={`w-4 h-4 mx-auto mb-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>CPU</p>
          <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            {price.cpu} ядра
          </p>
        </div>
        <div className={`rounded-xl p-2.5 text-center ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <ServerStackIcon className={`w-4 h-4 mx-auto mb-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>RAM</p>
          <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            {price.ram} GB
          </p>
        </div>
        <div className={`rounded-xl p-2.5 text-center ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <DocumentIcon className={`w-4 h-4 mx-auto mb-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Диск</p>
          <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            {price.disk} GB
          </p>
        </div>
      </div>

      {/* Location */}
      <div className={`mt-4 pt-3 border-t flex justify-between items-center ${
        darkMode ? 'border-gray-700' : 'border-gray-100'
      }`}>
        <div className={`text-xs flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <span>{locationEmoji}</span>
          <span>{translatedLocation}</span>
        </div>
        <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {new Date(price.lastUpdated).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  )
}