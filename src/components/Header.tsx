'use client'

import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Header() {
  const [currentTime, setCurrentTime] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      setCurrentTime(timeString)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <nav className="fixed left-0 top-0 z-50 flex w-full items-start justify-between px-6 py-6 text-[#111] md:px-12 md:py-8">
      <Link
        to="/"
        className="font-display hover-trigger z-50 text-lg font-bold leading-tight tracking-tight"
        data-cursor="hover"
      >
        YUNOSUKE
        <br />
        YOSHINO
      </Link>

      <div className="z-50 hidden flex-col items-end gap-1 font-mono text-xs uppercase tracking-wide md:flex">
        <div className="mb-2 flex gap-8">
          <a href="/#about" className="hover-trigger transition-opacity hover:opacity-50">
            About
          </a>
          <a href="/#works" className="hover-trigger transition-opacity hover:opacity-50">
            Works
          </a>
          <a href="/#articles" className="hover-trigger transition-opacity hover:opacity-50">
            Articles
          </a>
          <a href="/#contact" className="hover-trigger transition-opacity hover:opacity-50">
            Contact
          </a>
        </div>
        <span className="opacity-40">Tokyo, Japan</span>
        <span className="opacity-40" suppressHydrationWarning>
          {currentTime}
        </span>
      </div>

      <button
        type="button"
        className="hover-trigger z-50 md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-80 bg-white shadow-2xl transform transition-transform duration-300 z-50 md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-8">
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className="absolute right-6 top-6 text-2xl"
            aria-label="Close menu"
          >
            ×
          </button>

          <nav className="mt-16 flex flex-col gap-6 font-mono text-lg uppercase">
            {(['about', 'works', 'articles', 'contact'] as const).map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => {
                  document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
                  setIsMenuOpen(false)
                }}
                className="text-left capitalize transition-opacity hover:opacity-50"
              >
                {section}
              </button>
            ))}
          </nav>

          <div className="mt-12 font-mono text-xs uppercase tracking-wide text-gray-400">
            <div>Tokyo, Japan</div>
            <div suppressHydrationWarning>{currentTime}</div>
          </div>
        </div>
      </div>
    </nav>
  )
}
