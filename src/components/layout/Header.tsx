'use client'

import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import {
  type HeaderSectionId,
  useCurrentTimeLabel,
  useHeaderVisibility,
  useLockedBodyScroll,
} from './headerHooks'

export default function Header() {
  const currentTime = useCurrentTimeLabel()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isVisible = useHeaderVisibility()
  const { scheduleSectionScroll } = useLockedBodyScroll(isMenuOpen)

  const handleMobileSectionClick = (section: HeaderSectionId) => {
    scheduleSectionScroll(section)
    setIsMenuOpen(false)
  }

  return (
    <>
      <nav
        className={`fixed left-0 top-0 z-50 flex w-full items-start justify-between px-6 py-6 text-[#111] transition-transform duration-300 md:px-12 md:py-8 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <Link
          to="/"
          className="font-display hover-trigger z-50 text-lg font-bold leading-tight tracking-tight"
          reloadDocument
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
          {currentTime && (
            <span className="opacity-40" suppressHydrationWarning>
              {currentTime}
            </span>
          )}
        </div>

        <button
          type="button"
          className="hover-trigger z-50 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 md:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Menu"
        className={`fixed top-0 right-0 z-[70] h-screen w-80 transform bg-white shadow-2xl transition-transform duration-300 supports-[height:100svh]:h-[100svh] md:hidden ${
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
                onClick={() => handleMobileSectionClick(section)}
                className="text-left capitalize transition-opacity hover:opacity-50"
              >
                {section}
              </button>
            ))}
          </nav>

          <div className="mt-12 font-mono text-xs uppercase tracking-wide text-gray-400">
            <div>Tokyo, Japan</div>
            {currentTime && <div suppressHydrationWarning>{currentTime}</div>}
          </div>
        </div>
      </div>
    </>
  )
}
