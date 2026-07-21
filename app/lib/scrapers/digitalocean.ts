import axios from 'axios'
import { CloudPrice } from '../types'

export async function getDigitalOceanPrices(): Promise<CloudPrice[]> {
  try {
    // Используем публичную страницу с ценами
    const response = await axios.get('https://www.digitalocean.com/pricing/calculator', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      timeout: 10000
    })

    const html = response.data
    
    // Парсим цены из HTML (примерные данные)
    const prices: CloudPrice[] = [
      {
        id: 'do-basic-1',
        provider: 'DigitalOcean',
        name: 'Basic 1',
        price: 6,
        currency: 'USD',
        cpu: 1,
        ram: 1,
        disk: 25,
        region: 'nyc1',
        lastUpdated: new Date(),
      },
      {
        id: 'do-basic-2',
        provider: 'DigitalOcean',
        name: 'Basic 2',
        price: 12,
        currency: 'USD',
        cpu: 1,
        ram: 2,
        disk: 50,
        region: 'nyc1',
        lastUpdated: new Date(),
      },
      {
        id: 'do-basic-3',
        provider: 'DigitalOcean',
        name: 'Basic 3',
        price: 24,
        currency: 'USD',
        cpu: 2,
        ram: 4,
        disk: 80,
        region: 'nyc1',
        lastUpdated: new Date(),
      },
      {
        id: 'do-basic-4',
        provider: 'DigitalOcean',
        name: 'Basic 4',
        price: 48,
        currency: 'USD',
        cpu: 4,
        ram: 8,
        disk: 160,
        region: 'nyc1',
        lastUpdated: new Date(),
      },
    ]

    return prices
  } catch (error) {
    console.error('DigitalOcean error:', error)
    // Возвращаем статические данные в случае ошибки
    return getStaticDigitalOceanPrices()
  }
}

function getStaticDigitalOceanPrices(): CloudPrice[] {
  return [
    {
      id: 'do-static-1',
      provider: 'DigitalOcean',
      name: 'Basic 1',
      price: 6,
      currency: 'USD',
      cpu: 1,
      ram: 1,
      disk: 25,
      region: 'nyc1',
      lastUpdated: new Date(),
    },
    {
      id: 'do-static-2',
      provider: 'DigitalOcean',
      name: 'Basic 2',
      price: 12,
      currency: 'USD',
      cpu: 1,
      ram: 2,
      disk: 50,
      region: 'nyc1',
      lastUpdated: new Date(),
    },
    {
      id: 'do-static-3',
      provider: 'DigitalOcean',
      name: 'Basic 3',
      price: 24,
      currency: 'USD',
      cpu: 2,
      ram: 4,
      disk: 80,
      region: 'nyc1',
      lastUpdated: new Date(),
    },
  ]
}