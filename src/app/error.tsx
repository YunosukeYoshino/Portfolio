'use client'

import { useEffect } from 'react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

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
    <>
      <Header />
      <main className="l-main">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-6xl font-bold text-red-300 mb-4">!</h1>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Something went wrong!</h2>
            <p className="text-gray-600 mb-8">
              申し訳ございませんが、エラーが発生しました。
              しばらく時間をおいてから再度お試しください。
            </p>
            <div className="space-x-4">
              <button
                onClick={reset}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                再試行
              </button>
              <a
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                ホームに戻る
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
