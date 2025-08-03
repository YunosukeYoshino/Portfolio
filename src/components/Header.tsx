'use client'

import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="l-header fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md">
      <div className="container-custom flex items-center justify-between py-4">
        <Link href="/" className="text-xl font-bold text-gray-900">
          Yunosuke Yoshino
        </Link>

        <button
          className={cn('c-humburger md:hidden', isMenuOpen && 'is-active')}
          onClick={toggleMenu}
          aria-label="メニューを開く"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav
          className={cn(
            'l-header__nav',
            'fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-md',
            'transform transition-transform duration-300 ease-in-out',
            'md:relative md:w-auto md:h-auto md:bg-transparent md:backdrop-blur-none',
            'md:transform-none md:transition-none',
            isMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
          )}
        >
          <ul className="flex flex-col pt-20 px-8 space-y-6 md:flex-row md:pt-0 md:px-0 md:space-y-0 md:space-x-8">
            <li>
              <Link
                href="/#about"
                className="block text-lg text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/#article"
                className="block text-lg text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Article
              </Link>
            </li>
            <li>
              <Link
                href="/#contact"
                className="block text-lg text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Overlay for mobile menu */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </div>
    </header>
  )
}
