export interface CloudPrice {
  id: string
  provider: 'DigitalOcean' | 'AWS' | 'Hetzner' | 'Vultr' | 'Linode'
  name: string
  price: number
  currency: string
  cpu: number
  ram: number
  disk: number
  region: string
  lastUpdated: Date
}

export interface PriceHistory {
  id: string
  provider: string
  name: string
  price: number
  timestamp: Date
}