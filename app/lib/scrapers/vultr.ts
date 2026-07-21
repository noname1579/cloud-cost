import { CloudPrice } from '../types'

export async function getVultrPrices(): Promise<CloudPrice[]> {
  // Vultr публичные цены
  return [
    {
      id: 'vultr-vc2-1',
      provider: 'Vultr',
      name: 'VC2 1GB',
      price: 6.00,
      currency: 'USD',
      cpu: 1,
      ram: 1,
      disk: 25,
      region: 'ewr',
      lastUpdated: new Date(),
    },
    {
      id: 'vultr-vc2-2',
      provider: 'Vultr',
      name: 'VC2 2GB',
      price: 12.00,
      currency: 'USD',
      cpu: 1,
      ram: 2,
      disk: 55,
      region: 'ewr',
      lastUpdated: new Date(),
    },
    {
      id: 'vultr-vc2-4',
      provider: 'Vultr',
      name: 'VC2 4GB',
      price: 24.00,
      currency: 'USD',
      cpu: 2,
      ram: 4,
      disk: 80,
      region: 'ewr',
      lastUpdated: new Date(),
    },
  ]
}