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
    <nav className="fixed top-0 left-0 w-full px-6 py-6 md:px-12 md:py-8 flex justify-between items-start z-50 text-[#111]">
      <Link
        to="/"
        className="font-display font-bold text-lg tracking-tight hover-trigger z-50 leading-tight"
        data-cursor="hover"
      >
        YUNOSUKE
        <br />
        YOSHINO
      </Link>

      <div className="hidden md:flex flex-col items-end gap-1 text-xs font-mono uppercase tracking-wide z-50">
        <div className="flex gap-8 mb-2">
          <a href="#about" className="hover:opacity-50 transition-opacity hover-trigger">
            About
          </a>
          <a href="#works" className="hover:opacity-50 transition-opacity hover-trigger">
            Works
          </a>
          <a href="#articles" className="hover:opacity-50 transition-opacity hover-trigger">
            Articles
          </a>
          <a href="#contact" className="hover:opacity-50 transition-opacity hover-trigger">
            Contact
          </a>
        </div>
        <span className="opacity-40">Tokyo, Japan</span>
        <span className="opacity-40">{currentTime}</span>
      </div>

      <button
        type="button"
        className="md:hidden hover-trigger z-50"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
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
            className="absolute top-6 right-6 text-2xl"
            aria-label="Close menu"
          >
            ×
          </button>

          <nav className="mt-16 flex flex-col gap-6 text-lg font-mono uppercase">
            {(['about', 'works', 'articles', 'contact'] as const).map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => {
                  document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
                  setIsMenuOpen(false)
                }}
                className="hover:opacity-50 transition-opacity text-left capitalize"
              >
                {section}
              </button>
            ))}
          </nav>

          <div className="mt-12 text-xs font-mono uppercase tracking-wide text-gray-400">
            <div>Tokyo, Japan</div>
            <div>{currentTime}</div>
          </div>
        </div>
      </div>
    </nav>
  )
}
