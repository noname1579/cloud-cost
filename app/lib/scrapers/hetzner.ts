import { CloudPrice } from '../types'

export async function getHetznerPrices(): Promise<CloudPrice[]> {
  try {
    // Используем публичные данные Hetzner
    // Источник: https://www.hetzner.com/cloud
    
    const prices: CloudPrice[] = [
      {
        id: 'hetzner-cx11',
        provider: 'Hetzner',
        name: 'CX11',
        price: 4.50,
        currency: 'EUR',
        cpu: 1,
        ram: 2,
        disk: 20,
        region: 'eu-central',
        lastUpdated: new Date(),
      },
      {
        id: 'hetzner-cx21',
        provider: 'Hetzner',
        name: 'CX21',
        price: 6.90,
        currency: 'EUR',
        cpu: 2,
        ram: 4,
        disk: 40,
        region: 'eu-central',
        lastUpdated: new Date(),
      },
      {
        id: 'hetzner-cx31',
        provider: 'Hetzner',
        name: 'CX31',
        price: 9.90,
        currency: 'EUR',
        cpu: 2,
        ram: 8,
        disk: 80,
        region: 'eu-central',
        lastUpdated: new Date(),
      },
      {
        id: 'hetzner-cx41',
        provider: 'Hetzner',
        name: 'CX41',
        price: 15.90,
        currency: 'EUR',
        cpu: 4,
        ram: 16,
        disk: 160,
        region: 'eu-central',
        lastUpdated: new Date(),
      },
      {
        id: 'hetzner-cx51',
        provider: 'Hetzner',
        name: 'CX51',
        price: 28.90,
        currency: 'EUR',
        cpu: 8,
        ram: 32,
        disk: 240,
        region: 'eu-central',
        lastUpdated: new Date(),
      },
    ]

    return prices
  } catch (error) {
    console.error('Hetzner error:', error)
    return getStaticHetznerPrices()
  }
}

function getStaticHetznerPrices(): CloudPrice[] {
  return [
    {
      id: 'hetzner-static-cx11',
      provider: 'Hetzner',
      name: 'CX11',
      price: 4.50,
      currency: 'EUR',
      cpu: 1,
      ram: 2,
      disk: 20,
      region: 'eu-central',
      lastUpdated: new Date(),
    },
    {
      id: 'hetzner-static-cx21',
      provider: 'Hetzner',
      name: 'CX21',
      price: 6.90,
      currency: 'EUR',
      cpu: 2,
      ram: 4,
      disk: 40,
      region: 'eu-central',
      lastUpdated: new Date(),
    },
    {
      id: 'hetzner-static-cx31',
      provider: 'Hetzner',
      name: 'CX31',
      price: 9.90,
      currency: 'EUR',
      cpu: 2,
      ram: 8,
      disk: 80,
      region: 'eu-central',
      lastUpdated: new Date(),
    },
  ]
}