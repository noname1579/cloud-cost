import axios from 'axios'

// Кэш курса валют (обновляем раз в час)
let cachedRates: { usd: number; eur: number } | null = null
let lastUpdate = 0

export async function getExchangeRates(): Promise<{ usd: number; eur: number }> {
  const now = Date.now()
  
  // Если кэш есть и не старше часа - используем его
  if (cachedRates && now - lastUpdate < 3600000) {
    return cachedRates
  }

  try {
    // Используем бесплатный API курсов валют
    const response = await axios.get(
      'https://api.exchangerate-api.com/v4/latest/USD',
      { timeout: 5000 }
    )
    
    cachedRates = {
      usd: 1,
      eur: response.data.rates.RUB / response.data.rates.USD || 90,
    }
    lastUpdate = now
    
    console.log(`💱 Курс валют обновлен: USD = ${cachedRates.usd}, EUR = ${cachedRates.eur}`)
    
    return cachedRates
  } catch (error) {
    console.error('Ошибка получения курса валют:', error)
    // Возвращаем приблизительные курсы
    return { usd: 1, eur: 90 }
  }
}

export function convertToRubles(price: number, currency: string): number {
  const rates = {
    USD: 1,
    EUR: 1.1, // будет заменено реальным курсом
    RUB: 0.011,
  }
  
  // Переводим в USD
  let usdPrice = price
  if (currency === 'EUR') usdPrice = price * 1.1
  else if (currency === 'RUB') usdPrice = price / 90
  
  // Переводим в рубли по текущему курсу
  return Math.round(usdPrice * 90)
}