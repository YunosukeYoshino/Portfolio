'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const tokyoTime = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Tokyo',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(now)
      setCurrentTime(tokyoTime)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <header className="l-header fixed top-0 z-[9997] w-full border-b border-white/10 bg-black/90 py-1 backdrop-blur-md">
      <div className="container-custom flex items-center justify-between py-6">
        {/* Left: Logo */}
        <Link href="/" className="text-display text-lg font-bold tracking-tight text-white">
          Yunosuke Yoshino
        </Link>

        {/* Center: Navigation - Hidden on mobile */}
        <nav className="hidden md:flex">
          <ul className="flex space-x-8">
            <li>
              <Link
                href="/#about"
                className="text-sm font-medium uppercase tracking-wide text-white transition-colors duration-300 hover:text-gray-300"
              >
                ABOUT
              </Link>
            </li>
            <li>
              <Link
                href="/#article"
                className="text-sm font-medium uppercase tracking-wide text-white transition-colors duration-300 hover:text-gray-300"
              >
                ARTICLES
              </Link>
            </li>
            <li>
              <Link
                href="/#contact"
                className="text-sm font-medium uppercase tracking-wide text-white transition-colors duration-300 hover:text-gray-300"
              >
                CONTACT
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right: CTA + Time Display */}
        <div className="hidden items-center space-x-6 md:flex">
          <Link
            href="/#contact"
            className="bg-white px-6 py-2 text-sm font-medium uppercase tracking-wide text-black transition-colors duration-300 hover:bg-gray-200"
          >
            Let's Work Together
          </Link>

          <div className="grid items-center text-xs uppercase tracking-wider text-gray-400">
            <div>TOKYO,</div>
            <div>{currentTime}</div>
          </div>
        </div>

        <button
          type="button"
          className={cn(
            'c-hamburger md:hidden relative flex flex-col w-8 h-8 justify-center items-center p-1',
            'rounded-lg transition-all duration-300 hover:bg-white/10 active:scale-95',
            'z-[100000]',
            isMenuOpen && 'is-active'
          )}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
          style={{ zIndex: 100000 }}
        >
          <span
            className={cn(
              'block h-0.5 w-5 bg-white transition-all duration-500 ease-in-out transform',
              isMenuOpen ? 'rotate-45 translate-y-1.5' : 'translate-y-0'
            )}
          />
          <span
            className={cn(
              'block h-0.5 w-5 bg-white transition-all duration-300 ease-in-out my-1',
              isMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
            )}
          />
          <span
            className={cn(
              'block h-0.5 w-5 bg-white transition-all duration-500 ease-in-out transform',
              isMenuOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-0'
            )}
          />
        </button>

        {/* Mobile Menu */}
        <nav
          className={cn(
            'l-header__nav',
            'fixed top-0 right-0 h-screen w-80',
            'backdrop-blur-2xl backdrop-saturate-150',
            'border-l border-gray-300/30 shadow-2xl',
            'transform transition-all duration-700 ease-out md:hidden',
            'before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:pointer-events-none',
            'z-[99999]',
            isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          )}
          style={{
            background:
              'linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(30, 30, 30, 0.92) 50%, rgba(15, 15, 15, 0.95) 100%)',
            backdropFilter: 'blur(32px) saturate(1.8) brightness(1.1)',
            boxShadow:
              'inset 1px 0 0 rgba(255,255,255,0.15), -20px 0 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
            position: 'fixed',
            zIndex: 99999,
          }}
        >
          {/* Menu Header */}
          <div className="border-b border-white/15 px-8 py-6 bg-black/20">
            <div className="text-xs uppercase tracking-widest text-gray-300">Menu</div>
          </div>

          {/* Navigation Items */}
          <ul className="flex flex-col px-8 pt-12">
            <li className="group">
              <Link
                href="/#about"
                className="flex items-center justify-between py-4 text-lg font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:text-gray-100 hover:pl-2 group-hover:bg-white/8 rounded-lg px-3 -mx-3"
                onClick={() => setIsMenuOpen(false)}
                style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)' }}
              >
                <span>About</span>
                <svg
                  className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </li>
            <li className="group">
              <Link
                href="/#article"
                className="flex items-center justify-between py-4 text-lg font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:text-gray-100 hover:pl-2 group-hover:bg-white/8 rounded-lg px-3 -mx-3"
                onClick={() => setIsMenuOpen(false)}
                style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)' }}
              >
                <span>Articles</span>
                <svg
                  className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </li>
            <li className="group">
              <Link
                href="/#contact"
                className="flex items-center justify-between py-4 text-lg font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:text-gray-100 hover:pl-2 group-hover:bg-white/8 rounded-lg px-3 -mx-3"
                onClick={() => setIsMenuOpen(false)}
                style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)' }}
              >
                <span>Contact</span>
                <svg
                  className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </li>
          </ul>

          {/* CTA Section */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-white/15 bg-gradient-to-t from-black/70 to-black/20 p-8">
            aria-label="メニューを閉じる"
            <Link
              href="/#contact"
              className="block w-full bg-white/15 border-2 border-white/30 text-center py-4 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-black hover:shadow-lg hover:shadow-white/30 hover:border-white rounded-lg"
              onClick={() => setIsMenuOpen(false)}
              style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.7)' }}
            >
              Let's Work Together
            </Link>
            {/* Time Display */}
            <div className="mt-6 text-center">
              <div
                className="text-xs uppercase tracking-widest text-gray-400"
                style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)' }}
              >
                Tokyo
              </div>
              <div
                className="text-sm text-gray-200 font-mono font-medium"
                style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.7)' }}
              >
                {currentTime}
              </div>
            </div>
          </div>
        </nav>

        {/* Enhanced Overlay for mobile menu */}
        <button
          type="button"
          className={cn(
            'fixed inset-0 bg-black/70 backdrop-blur-md md:hidden transition-all duration-700',
            'bg-gradient-radial from-black/80 via-black/70 to-black/60',
            'z-[99998]',
            isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          )}
          style={{
            background:
              'radial-gradient(circle at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.4) 100%)',
            position: 'fixed',
            zIndex: 99998,
          }}
          onClick={() => setIsMenuOpen(false)}
        />
      </div>
    </header>
  )
}
