'use client'

import { useEffect, useState, useMemo } from 'react'
import { PriceCard } from '../components/PriceCard'
import { PriceChart } from '../components/PriceChart'
import { CloudPrice } from '../lib/types'
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
  XMarkIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const [prices, setPrices] = useState<CloudPrice[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [rubRate, setRubRate] = useState<number>(90)
  const [showRub, setShowRub] = useState(true)
  const [selectedProvider, setSelectedProvider] = useState<string>('Все')
  const [stats, setStats] = useState({
    total: 0,
    providers: 0,
    cheapest: 0,
    cheapestRub: 0,
    averagePrice: 0,
  })

  const filteredPrices = useMemo(() => {
    if (!prices || prices.length === 0) {
      return []
    }
    if (selectedProvider === 'Все') {
      return prices
    }
    return prices.filter(p => p.provider === selectedProvider)
  }, [prices, selectedProvider])

  const providers = useMemo(() => {
    if (!prices || prices.length === 0) {
      return ['Все']
    }
    const unique = new Set(prices.map(p => p.provider))
    return ['Все', ...Array.from(unique)]
  }, [prices])

  const chartData = useMemo(() => {
    if (!filteredPrices || filteredPrices.length === 0) {
      return []
    }
    return filteredPrices.map((p: CloudPrice) => ({
      name: `${p.provider || 'Unknown'} ${p.name || 'Unknown'}`,
      price: p.price || 0,
      priceRub: (p.price || 0) * (rubRate || 90),
    }))
  }, [filteredPrices, rubRate])

  useEffect(() => {
    fetchPrices()
    loadExchangeRates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      
      if (!response.ok) {
        console.error('API error:', response.status)
        throw new Error('Failed to fetch')
      }
      
      const data = await response.json()
      
      if (!data || data.length === 0) {
        console.warn('No data from API')
        setPrices([])
        setLoading(false)
        return
      }
      
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
      }))

      setPrices(formattedPrices)
      
      if (formattedPrices.length > 0) {
        const providersSet = new Set(formattedPrices.map((p: CloudPrice) => p.provider))
        const cheapest = formattedPrices.reduce((min: number, p: CloudPrice) => 
          p.price < min ? p.price : min, Infinity
        )
        
        const avg = formattedPrices.reduce((sum: number, p: CloudPrice) => sum + p.price, 0) / formattedPrices.length
        
        setStats({
          total: formattedPrices.length,
          providers: providersSet.size,
          cheapest: Math.round(cheapest * 100) / 100,
          cheapestRub: Math.round(cheapest * rubRate),
          averagePrice: Math.round(avg * 100) / 100,
        })
      }

      try {
        const alertsResponse = await fetch('/api/alerts')
        if (alertsResponse.ok) {
          const alertsData = await alertsResponse.json()
          if (alertsData && alertsData.length > 0) {
            setAlerts(alertsData)
            toast.success(`📢 ${alertsData.length} новых уведомлений о снижении цен!`)
          }
        }
      } catch (error) {
        console.error('Error fetching alerts:', error)
      }

    } catch (error) {
      console.error('Error:', error)
      toast.error('Ошибка загрузки данных')
      setPrices([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Загрузка цен...</p>
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
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                darkMode ? 'bg-blue-600' : 'bg-linear-to-br from-blue-600 to-indigo-600'
              }`}>
                <CloudIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Cloud Cost Monitor
                </h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  ☁️ Оптимизируй расходы на облачные сервера
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
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
              >
                {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>

              {alerts && alerts.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-600 rounded-full text-sm border border-red-200">
                  <BellIcon className="w-4 h-4" />
                  {alerts.length} новых
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className={`rounded-2xl p-6 border transition-all hover:shadow-lg ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Всего планов</p>
                <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {filteredPrices ? filteredPrices.length : 0}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                darkMode ? 'bg-blue-900/30' : 'bg-blue-50'
              }`}>
                <CloudIcon className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </div>
          </div>

          <div className={`rounded-2xl p-6 border transition-all hover:shadow-lg ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Провайдеров</p>
                <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {filteredPrices ? new Set(filteredPrices.map(p => p.provider)).size : 0}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                darkMode ? 'bg-green-900/30' : 'bg-green-50'
              }`}>
                <ChartBarIcon className={`w-6 h-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
            </div>
          </div>

          <div className={`rounded-2xl p-6 border transition-all hover:shadow-lg ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {showRub ? 'Самый дешевый (₽)' : 'Самый дешевый ($)'}
                </p>
                <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {filteredPrices && filteredPrices.length > 0 ? (
                    showRub 
                      ? `${Math.round(Math.min(...filteredPrices.map(p => p.price || 0)) * rubRate)} ₽`
                      : `$${Math.min(...filteredPrices.map(p => p.price || 0)).toFixed(2)}/мес`
                  ) : '-'}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'
              }`}>
                <CurrencyDollarIcon className={`w-6 h-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              </div>
            </div>
          </div>

          <div className={`rounded-2xl p-6 border transition-all hover:shadow-lg ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Средняя цена</p>
                <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {filteredPrices && filteredPrices.length > 0 ? (
                    showRub 
                      ? `${Math.round((filteredPrices.reduce((sum, p) => sum + (p.price || 0), 0) / filteredPrices.length) * rubRate)} ₽`
                      : `${(filteredPrices.reduce((sum, p) => sum + (p.price || 0), 0) / filteredPrices.length).toFixed(2)}/мес`
                  ) : '-'}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                darkMode ? 'bg-purple-900/30' : 'bg-purple-50'
              }`}>
                <ArrowTrendingUpIcon className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
            </div>
          </div>
        </div>

        {alerts && alerts.length > 0 && (
          <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <BellIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-green-800">
                  🎯 Цены снизились!
                </h3>
                <div className="mt-1 space-y-1">
                  {alerts.slice(0, 5).map((alert, index) => {
                    const savings = alert.oldPrice && alert.newPrice 
                      ? Math.round((1 - alert.newPrice/alert.oldPrice) * 100)
                      : 0
                    return (
                      <p key={index} className="text-sm text-green-700 flex items-center gap-2">
                        <span className="font-medium">{alert.name || 'Товар'}</span>
                        <span className="text-gray-500 line-through">{alert.oldPrice || 0}$</span>
                        <ArrowTrendingDownIcon className="w-4 h-4 text-green-600" />
                        <span className="font-bold text-green-600">{alert.newPrice || 0}$</span>
                        {savings > 0 && (
                          <span className="px-2 py-0.5 bg-green-200 text-green-800 rounded-full text-xs font-bold">
                            -{savings}%
                          </span>
                        )}
                      </p>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {providers && providers.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {providers.map((provider) => (
              <button
                key={provider}
                onClick={() => setSelectedProvider(provider)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedProvider === provider
                    ? darkMode
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {provider}
                {provider !== 'Все' && (
                  <span className="ml-1 text-xs opacity-60">
                    ({prices ? prices.filter(p => p.provider === provider).length : 0})
                  </span>
                )}
              </button>
            ))}
            {selectedProvider !== 'Все' && (
              <button
                onClick={() => setSelectedProvider('Все')}
                className={`px-2 py-1.5 rounded-full text-sm transition-all ${
                  darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {chartData && chartData.length > 0 && (
          <div className={`rounded-2xl p-6 border mb-12 transition-all hover:shadow-lg ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                📊 Сравнение цен
                {selectedProvider !== 'Все' && (
                  <span className={`ml-2 text-sm font-normal ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    ({selectedProvider})
                  </span>
                )}
              </h2>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {showRub ? 'Цены в ₽' : 'Цены в $'}
                {chartData.length > 0 && ` • ${chartData.length} планов`}
              </span>
            </div>
            <div className="h-80">
              <PriceChart 
                data={chartData} 
                darkMode={darkMode}
                showRub={showRub}
                rubRate={rubRate}
              />
            </div>
          </div>
        )}

        {filteredPrices && filteredPrices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPrices.map((price, index) => (
              <div key={price.id || `price-${index}`} style={{ animationDelay: `${index * 50}ms` }}>
                <PriceCard 
                  price={price} 
                  rubRate={rubRate}
                  showRub={showRub}
                  darkMode={darkMode}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <CloudIcon className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
            <h3 className={`text-xl font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {prices && prices.length === 0 
                ? 'Нет данных о ценах' 
                : 'Нет товаров для выбранного провайдера'}
            </h3>
            {prices && prices.length === 0 ? (
              <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Попробуйте обновить страницу или проверьте подключение к интернету
              </p>
            ) : (
              <button
                onClick={() => setSelectedProvider('Все')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Показать все
              </button>
            )}
          </div>
        )}

        <footer className={`mt-12 pt-6 border-t text-center text-sm ${
          darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'
        }`}>
          <p>Курс: 1$ = {Math.round(rubRate)} ₽ • Обновлено: {new Date().toLocaleString()}</p>
          <p className="mt-1">☁️ Cloud Cost Monitor — экономь на облачных серверах</p>
        </footer>
      </main>
    </div>
  )
}