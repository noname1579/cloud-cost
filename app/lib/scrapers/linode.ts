import { CloudPrice } from '../types'

export async function getLinodePrices(): Promise<CloudPrice[]> {
  // Linode публичные цены
  return [
    {
      id: 'linode-nanode-1',
      provider: 'Linode',
      name: 'Nanode 1GB',
      price: 5.00,
      currency: 'USD',
      cpu: 1,
      ram: 1,
      disk: 25,
      region: 'us-east',
      lastUpdated: new Date(),
    },
    {
      id: 'linode-standard-2',
      provider: 'Linode',
      name: 'Standard 2GB',
      price: 10.00,
      currency: 'USD',
      cpu: 1,
      ram: 2,
      disk: 50,
      region: 'us-east',
      lastUpdated: new Date(),
    },
    {
      id: 'linode-standard-4',
      provider: 'Linode',
      name: 'Standard 4GB',
      price: 20.00,
      currency: 'USD',
      cpu: 2,
      ram: 4,
      disk: 80,
      region: 'us-east',
      lastUpdated: new Date(),
    },
  ]
}