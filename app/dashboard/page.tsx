'use client'

import { useEffect, useState, useMemo } from 'react'
import { PriceCard } from '../components/PriceCard'
import { PriceChart } from '../components/PriceChart'
import { CloudPrice, FilterOptions, ComparisonItem } from '../lib/types'
import { getExchangeRates } from '../lib/currency'
import { 
  ChartBarIcon, 
  CloudIcon, 
  CurrencyDollarIcon,
  BellIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  SunIcon,
  MoonIcon,
  XMarkIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  StarIcon,
  ArrowsRightLeftIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'
import Papa from 'papaparse'

export default function Dashboard() {
  const [prices, setPrices] = useState<CloudPrice[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [rubRate, setRubRate] = useState<number>(90)
  const [showRub, setShowRub] = useState(true)
  const [selectedProvider, setSelectedProvider] = useState<string>('Все')
  const [favorites, setFavorites] = useState<string[]>([])
  const [comparison, setComparison] = useState<ComparisonItem[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'cpu' | 'ram' | 'disk'>('price')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState(0)
  const [filters, setFilters] = useState<FilterOptions>({
    providers: [],
    minPrice: 0,
    maxPrice: 100,
    minCPU: 0,
    minRAM: 0,
    search: '',
  })

  const loadingMessages = [
    'Инициализация Cloud Cost...',
    'Подключение к облачным провайдерам...',
    'Получение цен...',
    'Обработка данных...',
    'Построение графиков...',
    'Почти готово...',
    'Запуск дашборда...'
  ]

  useEffect(() => {
    fetchPrices()
    loadExchangeRates()
    loadFavorites()
    loadComparison()
  }, [])

  useEffect(() => {
    if (!loading) return
    
    const interval = setInterval(() => {
      setLoadingStatus((prev) => (prev + 1) % loadingMessages.length)
    }, 1200)
    
    return () => clearInterval(interval)
  }, [loading])

  const loadFavorites = () => {
    const saved = localStorage.getItem('favorites')
    if (saved) setFavorites(JSON.parse(saved))
  }

  const loadComparison = () => {
    const saved = localStorage.getItem('comparison')
    if (saved) setComparison(JSON.parse(saved))
  }

  const loadExchangeRates = async () => {
    try {
      const rates = await getExchangeRates()
      setRubRate(rates.eur || 90)
    } catch (error) {
      console.error('Error loading exchange rates:', error)
      setRubRate(90)
    }
  }

  const fetchPrices = async () => {
    try {
      const response = await fetch('/api/prices')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      
      const formattedPrices: CloudPrice[] = data.map((item: any) => ({
        id: item.id || `temp-${Math.random()}`,
        provider: item.provider?.name || item.provider || 'Unknown',
        name: item.name || 'Unknown',
        price: typeof item.price === 'number' ? item.price : 0,
        currency: item.currency || 'USD',
        cpu: item.cpu || 0,
        ram: item.ram || 0,
        disk: item.disk || 0,
        region: item.region || 'Unknown',
        lastUpdated: item.createdAt ? new Date(item.createdAt) : new Date(),
        isFavorite: favorites.includes(item.id),
      }))

      setPrices(formattedPrices)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id]
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
    
    setPrices(prices.map(p => ({
      ...p,
      isFavorite: newFavorites.includes(p.id)
    })))
  }

  const toggleComparison = (item: ComparisonItem) => {
    const exists = comparison.find(c => c.id === item.id)
    let newComparison
    if (exists) {
      newComparison = comparison.filter(c => c.id !== item.id)
    } else {
      if (comparison.length >= 3) {
        toast.error('Можно сравнить не более 3 товаров')
        return
      }
      newComparison = [...comparison, item]
    }
    setComparison(newComparison)
    localStorage.setItem('comparison', JSON.stringify(newComparison))
    if (newComparison.length > 0) setShowComparison(true)
  }

  const filteredAndSortedPrices = useMemo(() => {
    let result = [...prices]

    if (searchTerm) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.provider.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedProvider !== 'Все') {
      result = result.filter(p => p.provider === selectedProvider)
    }

    if (filters.minPrice > 0) {
      result = result.filter(p => p.price >= filters.minPrice)
    }
    if (filters.maxPrice < 100) {
      result = result.filter(p => p.price <= filters.maxPrice)
    }

    if (filters.minCPU > 0) {
      result = result.filter(p => p.cpu >= filters.minCPU)
    }

    if (filters.minRAM > 0) {
      result = result.filter(p => p.ram >= filters.minRAM)
    }

    result.sort((a, b) => {
      let compare = 0
      switch (sortBy) {
        case 'price': compare = a.price - b.price; break
        case 'name': compare = a.name.localeCompare(b.name); break
        case 'cpu': compare = a.cpu - b.cpu; break
        case 'ram': compare = a.ram - b.ram; break
        case 'disk': compare = a.disk - b.disk; break
        default: compare = 0
      }
      return sortOrder === 'asc' ? compare : -compare
    })

    return result
  }, [prices, searchTerm, selectedProvider, filters, sortBy, sortOrder])

  const stats = useMemo(() => {
    if (!filteredAndSortedPrices.length) {
      return { total: 0, providers: 0, cheapest: 0, average: 0, savings: 0 }
    }
    
    const total = filteredAndSortedPrices.length
    const providers = new Set(filteredAndSortedPrices.map(p => p.provider)).size
    const cheapest = Math.min(...filteredAndSortedPrices.map(p => p.price))
    const average = filteredAndSortedPrices.reduce((s, p) => s + p.price, 0) / total
    const maxPrice = Math.max(...filteredAndSortedPrices.map(p => p.price))
    const savings = Math.round((maxPrice - cheapest) * 12)

    return { total, providers, cheapest, average, savings }
  }, [filteredAndSortedPrices])

  const exportCSV = () => {
    const data = filteredAndSortedPrices.map(p => ({
      'Провайдер': p.provider,
      'Название': p.name,
      'Цена': `${p.price} ${p.currency}`,
      'CPU': `${p.cpu} ядер`,
      'RAM': `${p.ram} GB`,
      'Диск': `${p.disk} GB`,
      'Регион': p.region,
    }))
    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cloud-prices-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('CSV экспортирован!')
  }

  const sortLabels: Record<string, string> = {
    price: 'Цена',
    name: 'Название',
    cpu: 'CPU',
    ram: 'RAM',
    disk: 'Диск',
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse delay-2000"></div>
          </div>

          <div>
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 animate-bounce-subtle">
                <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C10.34 2 8.78 2.53 7.5 3.44C6.22 4.35 5.28 5.6 4.86 7.06C3.21 7.44 1.8 8.48 1 9.94C0.2 11.4 0 13.1 0 14.9C0 17.2 0.8 19.3 2.2 20.9C3.6 22.5 5.5 23.5 7.5 23.5H16.5C18.5 23.5 20.4 22.5 21.8 20.9C23.2 19.3 24 17.2 24 14.9C24 12.6 23.2 10.5 21.8 8.9C20.4 7.3 18.5 6.3 16.5 6.3C16.3 6.3 16.1 6.3 15.9 6.3C15.1 4.9 13.9 3.8 12.5 3.1C12.3 3.0 12.2 3.0 12 3.0V2Z" />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-2xl border-2 border-blue-400/30 animate-spin-slow" style={{ padding: '4px' }}></div>
              <div className="absolute inset-0 rounded-2xl border-2 border-purple-400/30 animate-spin-slow-reverse" style={{ padding: '8px' }}></div>
            </div>

            <h2 className="mt-6 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Cloud Cost
            </h2>

            <div className="mt-4 h-8 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <span className="text-gray-600 dark:text-gray-300 font-medium transition-all duration-300">
                  {loadingMessages[loadingStatus]}
                </span>
              </div>
            </div>

            <div className="mt-6 w-64 mx-auto">
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${((loadingStatus + 1) / loadingMessages.length) * 100}%` 
                  }}
                ></div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-linear-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
        darkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-100'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                darkMode ? 'bg-blue-600' : 'bg-gradient-to-br from-blue-600 to-indigo-600'
              }`}>
                <svg className="w-6 h-6 text-white fill-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C10.34 2 8.78 2.53 7.5 3.44C6.22 4.35 5.28 5.6 4.86 7.06C3.21 7.44 1.8 8.48 1 9.94C0.2 11.4 0 13.1 0 14.9C0 17.2 0.8 19.3 2.2 20.9C3.6 22.5 5.5 23.5 7.5 23.5H16.5C18.5 23.5 20.4 22.5 21.8 20.9C23.2 19.3 24 17.2 24 14.9C24 12.6 23.2 10.5 21.8 8.9C20.4 7.3 18.5 6.3 16.5 6.3C16.3 6.3 16.1 6.3 15.9 6.3C15.1 4.9 13.9 3.8 12.5 3.1C12.3 3.0 12.2 3.0 12 3.0V2Z" />
                </svg>
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Cloud Cost
                </h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  ☁️ Оптимизируй расходы на облачные сервера
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <MagnifyingGlassIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Поиск по названию..."
                  className={`pl-9 pr-4 py-1.5 rounded-lg text-sm border transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title="Фильтры"
              >
                <FunnelIcon className="w-5 h-5" />
              </button>

              <button
                onClick={exportCSV}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title="Экспорт в CSV"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowRub(!showRub)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showRub ? '₽' : '$'}
              </button>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={darkMode ? 'Светлая тема' : 'Тёмная тема'}
              >
                {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>

              {comparison.length > 0 && (
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    showComparison
                      ? 'bg-blue-600 text-white'
                      : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ArrowsRightLeftIcon className="w-4 h-4" />
                  Сравнить ({comparison.length})
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className={`mt-4 p-4 rounded-xl border ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Мин. цена ($)
                  </label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: parseFloat(e.target.value) || 0})}
                    className={`w-full mt-1 p-2 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                    min="0"
                    step="0.5"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Макс. цена ($)
                  </label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: parseFloat(e.target.value) || 100})}
                    className={`w-full mt-1 p-2 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                    min="0"
                    step="0.5"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Мин. CPU (ядер)
                  </label>
                  <input
                    type="number"
                    value={filters.minCPU}
                    onChange={(e) => setFilters({...filters, minCPU: parseInt(e.target.value) || 0})}
                    className={`w-full mt-1 p-2 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                    min="0"
                    step="1"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Мин. RAM (GB)
                  </label>
                  <input
                    type="number"
                    value={filters.minRAM}
                    onChange={(e) => setFilters({...filters, minRAM: parseInt(e.target.value) || 0})}
                    className={`w-full mt-1 p-2 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                    min="0"
                    step="1"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setFilters({ providers: [], minPrice: 0, maxPrice: 100, minCPU: 0, minRAM: 0, search: '' })}
                  className={`text-sm px-4 py-1.5 rounded-lg transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Сбросить фильтры
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`rounded-2xl p-4 border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'
          }`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Всего планов</p>
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {stats.total}
            </p>
          </div>
          <div className={`rounded-2xl p-4 border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'
          }`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Провайдеров</p>
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {stats.providers}
            </p>
          </div>
          <div className={`rounded-2xl p-4 border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'
          }`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Самый дешевый</p>
            <p className={`text-2xl font-bold text-green-600`}>
              {showRub 
                ? `${Math.round(stats.cheapest * rubRate)} ₽`
                : `$${stats.cheapest.toFixed(2)}`
              }
            </p>
          </div>
          <div className={`rounded-2xl p-4 border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'
          }`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Экономия в год</p>
            <p className={`text-2xl font-bold text-blue-600`}>
              {showRub 
                ? `${Math.round(stats.savings * rubRate)} ₽`
                : `$${stats.savings}`
              }
            </p>
          </div>
        </div>

        {showComparison && comparison.length > 0 && (
          <div className={`rounded-2xl p-4 border mb-8 ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                📊 Сравнение ({comparison.length}/3)
              </h3>
              <button
                onClick={() => setComparison([])}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Очистить все
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comparison.map((item) => (
                <div key={item.id} className={`p-4 rounded-xl border ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex justify-between">
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.name}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {item.provider}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleComparison(item)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Цена</p>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        ${item.price}
                      </p>
                    </div>
                    <div>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>CPU</p>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.cpu} ядер
                      </p>
                    </div>
                    <div>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>RAM</p>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.ram} GB
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Сортировка:
          </span>
          {['price', 'name', 'cpu', 'ram', 'disk'].map((field) => (
            <button
              key={field}
              onClick={() => {
                if (sortBy === field) {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                } else {
                  setSortBy(field as any)
                  setSortOrder('asc')
                }
              }}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                sortBy === field
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-600 text-white'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {sortLabels[field] || field}
              {sortBy === field && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
            </button>
          ))}
        </div>

        {filteredAndSortedPrices.length > 0 && (
          <div className={`rounded-2xl p-4 border mb-8 ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                📊 Сравнение цен
              </h2>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {filteredAndSortedPrices.length} планов
              </span>
            </div>
            <div className="h-80">
              <PriceChart 
                data={filteredAndSortedPrices.map(p => ({
                  name: `${p.provider} ${p.name}`,
                  price: showRub ? Math.round(p.price * rubRate) : p.price,
                }))}
                darkMode={darkMode}
                showRub={showRub}
                rubRate={rubRate}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedPrices.map((price, index) => (
            <PriceCard 
              key={price.id || `price-${index}`}
              price={price}
              rubRate={rubRate}
              showRub={showRub}
              darkMode={darkMode}
              isFavorite={favorites.includes(price.id)}
              onToggleFavorite={() => toggleFavorite(price.id)}
              onToggleComparison={() => toggleComparison({
                id: price.id,
                name: price.name,
                provider: price.provider,
                price: price.price,
                cpu: price.cpu,
                ram: price.ram,
                disk: price.disk,
              })}
              isInComparison={comparison.some(c => c.id === price.id)}
            />
          ))}
        </div>

        {filteredAndSortedPrices.length === 0 && (
          <div className="text-center py-16">
            <CloudIcon className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
            <h3 className={`text-xl font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Нет товаров по выбранным фильтрам
            </h3>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedProvider('Все')
                setFilters({ providers: [], minPrice: 0, maxPrice: 100, minCPU: 0, minRAM: 0, search: '' })
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Сбросить фильтры
            </button>
          </div>
        )}

        <footer className={`mt-12 pt-6 border-t text-center text-sm ${
          darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'
        }`}>
          <p>Курс: 1$ = {Math.round(rubRate)} ₽ • Обновлено: {new Date().toLocaleString()}</p>
          <p className="mt-1">☁️ Cloud Cost — экономь на облачных серверах</p>
        </footer>
      </main>
    </div>
  )
}