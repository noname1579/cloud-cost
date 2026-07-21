import { NextResponse } from 'next/server'
import { getAllPrices } from '@/app/lib/scrapers'

export async function GET() {
  try {
    const prices = await getAllPrices()
    
    // Проверяем, что данные получены
    if (!prices || prices.length === 0) {
      console.warn('⚠️ Цены не получены, возвращаем заглушку')
      return NextResponse.json(getFallbackPrices())
    }
    
    return NextResponse.json(prices)
  } catch (error) {
    console.error('Error fetching prices:', error)
    // Возвращаем заглушку в случае ошибки
    return NextResponse.json(getFallbackPrices())
  }
}

// Заглушка на случай, если API не работает
function getFallbackPrices() {
  return [
    {
      id: 'do-fallback-1',
      provider: { name: 'DigitalOcean' },
      name: 'Basic 1',
      price: 6,
      currency: 'USD',
      cpu: 1,
      ram: 1,
      disk: 25,
      region: 'nyc1',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'do-fallback-2',
      provider: { name: 'DigitalOcean' },
      name: 'Basic 2',
      price: 12,
      currency: 'USD',
      cpu: 1,
      ram: 2,
      disk: 50,
      region: 'nyc1',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'aws-fallback-1',
      provider: { name: 'AWS' },
      name: 't2.micro',
      price: 8.5,
      currency: 'USD',
      cpu: 1,
      ram: 1,
      disk: 20,
      region: 'us-east-1',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'aws-fallback-2',
      provider: { name: 'AWS' },
      name: 't2.small',
      price: 17,
      currency: 'USD',
      cpu: 1,
      ram: 2,
      disk: 20,
      region: 'us-east-1',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'hetzner-fallback-1',
      provider: { name: 'Hetzner' },
      name: 'CX11',
      price: 4.5,
      currency: 'EUR',
      cpu: 1,
      ram: 2,
      disk: 20,
      region: 'eu-central',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'hetzner-fallback-2',
      provider: { name: 'Hetzner' },
      name: 'CX21',
      price: 6.9,
      currency: 'EUR',
      cpu: 2,
      ram: 4,
      disk: 40,
      region: 'eu-central',
      createdAt: new Date().toISOString(),
    },
  ]
}