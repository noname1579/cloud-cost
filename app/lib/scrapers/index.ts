import { getDigitalOceanPrices } from './digitalocean'
import { getAWSPrices } from './aws'
import { getHetznerPrices } from './hetzner'
import { CloudPrice } from '../types'

export async function getAllPrices(): Promise<CloudPrice[]> {
  console.log('🔄 Получение цен с облачных провайдеров...')
  
  try {
    const [digitalOcean, aws, hetzner] = await Promise.all([
      getDigitalOceanPrices().catch(() => {
        console.warn('⚠️ Ошибка DigitalOcean, возвращаем заглушку')
        return getFallbackDigitalOcean()
      }),
      getAWSPrices().catch(() => {
        console.warn('⚠️ Ошибка AWS, возвращаем заглушку')
        return getFallbackAWS()
      }),
      getHetznerPrices().catch(() => {
        console.warn('⚠️ Ошибка Hetzner, возвращаем заглушку')
        return getFallbackHetzner()
      }),
    ])

    const allPrices = [...digitalOcean, ...aws, ...hetzner]
    
    console.log(`✅ Получено цен: ${allPrices.length}`)
    console.log(`  - DigitalOcean: ${digitalOcean.length}`)
    console.log(`  - AWS: ${aws.length}`)
    console.log(`  - Hetzner: ${hetzner.length}`)

    return allPrices
  } catch (error) {
    console.error('❌ Ошибка получения цен:', error)
    // Возвращаем полную заглушку
    return getAllFallbackPrices()
  }
}

// Заглушки для каждого провайдера
function getFallbackDigitalOcean(): CloudPrice[] {
  return [
    {
      id: 'do-fallback-1',
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
      id: 'do-fallback-2',
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
  ]
}

function getFallbackAWS(): CloudPrice[] {
  return [
    {
      id: 'aws-fallback-1',
      provider: 'AWS',
      name: 't2.micro',
      price: 8.5,
      currency: 'USD',
      cpu: 1,
      ram: 1,
      disk: 20,
      region: 'us-east-1',
      lastUpdated: new Date(),
    },
    {
      id: 'aws-fallback-2',
      provider: 'AWS',
      name: 't2.small',
      price: 17,
      currency: 'USD',
      cpu: 1,
      ram: 2,
      disk: 20,
      region: 'us-east-1',
      lastUpdated: new Date(),
    },
  ]
}

function getFallbackHetzner(): CloudPrice[] {
  return [
    {
      id: 'hetzner-fallback-1',
      provider: 'Hetzner',
      name: 'CX11',
      price: 4.5,
      currency: 'EUR',
      cpu: 1,
      ram: 2,
      disk: 20,
      region: 'eu-central',
      lastUpdated: new Date(),
    },
    {
      id: 'hetzner-fallback-2',
      provider: 'Hetzner',
      name: 'CX21',
      price: 6.9,
      currency: 'EUR',
      cpu: 2,
      ram: 4,
      disk: 40,
      region: 'eu-central',
      lastUpdated: new Date(),
    },
  ]
}

function getAllFallbackPrices(): CloudPrice[] {
  return [
    ...getFallbackDigitalOcean(),
    ...getFallbackAWS(),
    ...getFallbackHetzner(),
  ]
}