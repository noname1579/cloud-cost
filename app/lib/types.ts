export interface CloudPrice {
  id: string
  provider: string
  name: string
  price: number
  currency: string
  cpu: number
  ram: number
  disk: number
  region: string
  lastUpdated: Date
  isFavorite?: boolean
}

export interface FilterOptions {
  providers: string[]
  minPrice: number
  maxPrice: number
  minCPU: number
  minRAM: number
  search: string
}

export interface ComparisonItem {
  id: string
  name: string
  provider: string
  price: number
  cpu: number
  ram: number
  disk: number
}