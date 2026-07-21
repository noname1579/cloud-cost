import { CloudPrice } from '../types'

export async function getAWSPrices(): Promise<CloudPrice[]> {
  try {
    // Используем публичные данные AWS
    // Источник: https://aws.amazon.com/ec2/pricing/
    
    const prices: CloudPrice[] = [
      {
        id: 'aws-t2-micro',
        provider: 'AWS',
        name: 't2.micro',
        price: 8.50,
        currency: 'USD',
        cpu: 1,
        ram: 1,
        disk: 20,
        region: 'us-east-1',
        lastUpdated: new Date(),
      },
      {
        id: 'aws-t2-small',
        provider: 'AWS',
        name: 't2.small',
        price: 17.00,
        currency: 'USD',
        cpu: 1,
        ram: 2,
        disk: 20,
        region: 'us-east-1',
        lastUpdated: new Date(),
      },
      {
        id: 'aws-t2-medium',
        provider: 'AWS',
        name: 't2.medium',
        price: 34.00,
        currency: 'USD',
        cpu: 2,
        ram: 4,
        disk: 20,
        region: 'us-east-1',
        lastUpdated: new Date(),
      },
      {
        id: 'aws-t3-micro',
        provider: 'AWS',
        name: 't3.micro',
        price: 8.40,
        currency: 'USD',
        cpu: 2,
        ram: 1,
        disk: 20,
        region: 'us-east-1',
        lastUpdated: new Date(),
      },
      {
        id: 'aws-t3-small',
        provider: 'AWS',
        name: 't3.small',
        price: 16.80,
        currency: 'USD',
        cpu: 2,
        ram: 2,
        disk: 20,
        region: 'us-east-1',
        lastUpdated: new Date(),
      },
      {
        id: 'aws-t3-medium',
        provider: 'AWS',
        name: 't3.medium',
        price: 33.60,
        currency: 'USD',
        cpu: 2,
        ram: 4,
        disk: 20,
        region: 'us-east-1',
        lastUpdated: new Date(),
      },
    ]

    return prices
  } catch (error) {
    console.error('AWS error:', error)
    return getStaticAWSPrices()
  }
}

function getStaticAWSPrices(): CloudPrice[] {
  return [
    {
      id: 'aws-static-t2-micro',
      provider: 'AWS',
      name: 't2.micro',
      price: 8.50,
      currency: 'USD',
      cpu: 1,
      ram: 1,
      disk: 20,
      region: 'us-east-1',
      lastUpdated: new Date(),
    },
    {
      id: 'aws-static-t2-small',
      provider: 'AWS',
      name: 't2.small',
      price: 17.00,
      currency: 'USD',
      cpu: 1,
      ram: 2,
      disk: 20,
      region: 'us-east-1',
      lastUpdated: new Date(),
    },
    {
      id: 'aws-static-t2-medium',
      provider: 'AWS',
      name: 't2.medium',
      price: 34.00,
      currency: 'USD',
      cpu: 2,
      ram: 4,
      disk: 20,
      region: 'us-east-1',
      lastUpdated: new Date(),
    },
  ]
}