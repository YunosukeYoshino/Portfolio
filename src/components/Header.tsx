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
    <header className="l-header fixed top-0 z-50 w-full border-b border-white/10 bg-black/90 py-1 backdrop-blur-md">
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
            LET'S GET STARTED
          </Link>

          <div className="grid items-center text-xs uppercase tracking-wider text-gray-400">
            <div>TOKYO,</div>
            <div>{currentTime}</div>
          </div>
        </div>

        <button
          type="button"
          className={cn(
            'c-humburger md:hidden flex flex-col w-6 h-6 justify-center items-center space-y-1 ml-auto',
            isMenuOpen && 'is-active'
          )}
          onClick={toggleMenu}
          aria-label="メニューを開く"
        >
          <span className="block h-0.5 w-full bg-white transition-transform"></span>
          <span className="block h-0.5 w-full bg-white transition-opacity"></span>
          <span className="block h-0.5 w-full bg-white transition-transform"></span>
        </button>

        {/* Mobile Menu */}
        <nav
          className={cn(
            'l-header__nav',
            'fixed top-0 right-0 h-full w-80 bg-black/95 backdrop-blur-md border-l border-white/10',
            'transform transition-transform duration-500 ease-out md:hidden',
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <ul className="flex flex-col space-y-8 px-8 pt-24">
            <li>
              <Link
                href="/#about"
                className="block text-base font-medium uppercase tracking-wide text-gray-300 transition-colors duration-300 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                ABOUT
              </Link>
            </li>
            <li>
              <Link
                href="/#article"
                className="block text-base font-medium uppercase tracking-wide text-gray-300 transition-colors duration-300 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                WORKS
              </Link>
            </li>
            <li>
              <Link
                href="/#contact"
                className="block text-base font-medium uppercase tracking-wide text-gray-300 transition-colors duration-300 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                CONTACT
              </Link>
            </li>
          </ul>
        </nav>

        {/* Overlay for mobile menu */}
        {isMenuOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsMenuOpen(false)}
            aria-label="メニューを閉じる"
          />
        )}
      </div>
    </header>
  )
}
