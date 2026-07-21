'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { CloudIcon } from '@heroicons/react/24/outline'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center p-8">
        <CloudIcon className="w-24 h-24 text-red-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Что-то пошло не так
        </h1>
        <p className="text-gray-500 mb-6">
          Произошла ошибка при загрузке страницы. Попробуйте обновить.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Попробовать снова
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  )
}