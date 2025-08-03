import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="l-footer bg-black border-t border-white/10 py-16">
      <div className="container-custom">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-semibold text-white mb-6 text-display">
              Let's create something amazing together
            </h3>
            <p className="text-gray-400 leading-relaxed mb-8 text-lg max-w-2xl">
              Always open to discussing new opportunities, collaborations, and innovative projects.
              Feel free to reach out if you have an exciting project in mind.
            </p>
            <div className="flex space-x-6">
              <a
                href="mailto:yunosukeyoshino@gmail.com"
                className="text-gray-400 hover:text-white transition-colors duration-300 group"
                aria-label="Email"
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm">Email</span>
                </div>
              </a>
              <a
                href="https://github.com/YunosukeYoshino"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300 group"
                aria-label="GitHub"
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span className="text-sm">GitHub</span>
                </div>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-6 text-white uppercase text-sm tracking-wider">
              Site Navigation
            </h4>
            <ul className="space-y-4">
              {[
                { href: '/#about' as const, label: 'About' },
                { href: '/#article' as const, label: 'Work' },
                { href: '/#contact' as const, label: 'Contact' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 text-sm block group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} Yunosuke Yoshino — Crafted with care
          </p>
          <p className="text-gray-600 text-xs mt-2 md:mt-0">
            Built with Next.js, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}
