import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Сравнение цен на облачные сервера',
  description: 'Сравнивайте цены на VPS/VDS от DigitalOcean, AWS, Hetzner и других провайдеров. Экономьте до 40% на облачных серверах.',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}