import Link from 'next/link'
import { CloudIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center p-8">
        <CloudIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Страница не найдена</h2>
        <p className="text-gray-500 mb-6">
          К сожалению, запрошенная страница не существует.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  )
}