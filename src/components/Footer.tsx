import { Link } from '@tanstack/react-router'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer id="contact" className="bg-[#F3F3F1] pt-32 pb-12 px-6 md:px-12 relative z-20">
      <div className="flex flex-col min-h-[60vh] justify-between">
        <div>
          <h2 className="text-[12vw] font-display font-medium leading-[0.8] tracking-tighter mb-12">
            Let's Talk
          </h2>
          <div className="max-w-2xl">
            <p className="font-mono text-sm md:text-base text-gray-600 leading-relaxed">
              Always open to discussing new opportunities, collaborations, and innovative projects.
              <br />
              Webサイト制作、アプリケーション開発、UI/UXデザインなど、
              <br className="hidden md:block" />
              お仕事のご依頼やご相談はお気軽にどうぞ。
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end border-t border-black/10 pt-8 mt-12">
          <div className="mb-8 md:mb-0">
            <Link
              to="/contact"
              className="text-2xl md:text-3xl font-bold hover:text-blue-600 transition-colors hover-trigger"
            >
              hello@yunosukeyoshino.com
            </Link>
            <p className="font-mono text-xs text-gray-500 mt-2">
              Based in Tokyo, Available Worldwide.
            </p>
          </div>

          <div className="flex gap-8 font-mono text-xs uppercase tracking-wide">
            <a
              href="https://github.com/YunosukeYoshino"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors hover-trigger"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-8 border-t border-black/10">
          <p className="text-xs text-gray-500 font-mono">© {currentYear} Yunosuke Yoshino</p>
          <Link
            to="/privacy-policy"
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors mt-4 md:mt-0"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
