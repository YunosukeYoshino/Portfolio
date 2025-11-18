'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const imageRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!imageRef.current || !sectionRef.current) return

    // メディアクエリでデスクトップサイズかチェック
    const mediaQuery = window.matchMedia('(min-width: 768px)')

    const setupAnimation = () => {
      // 既存のScrollTriggerを削除
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill()
      })

      if (mediaQuery.matches) {
        // デスクトップ: Pin機能を使用
        const ctx = gsap.context(() => {
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            pin: imageRef.current,
            pinSpacing: false,
            anticipatePin: 1,
          })
        }, sectionRef)

        return () => ctx.revert()
      }
      // モバイル: 何もしない（通常の配置）
    }

    setupAnimation()

    // リサイズ時に再設定
    mediaQuery.addEventListener('change', setupAnimation)

    return () => {
      mediaQuery.removeEventListener('change', setupAnimation)
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill()
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="p-about py-24 md:py-32 bg-gray-50 border-t border-black/10"
      id="about"
    >
      <div className="container-custom">
        <header className="mb-16">
          <h2 className="text-section-title text-display text-black mb-6 uppercase tracking-tight">
            About Me
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl">
            Passionate about creating digital experiences that bridge the gap between technology and
            human interaction.
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="space-y-8 order-2 md:order-1">
              <div>
                <h3 className="text-2xl font-semibold text-black mb-6 text-display uppercase tracking-tight">
                  Hello, I'm Yunosuke
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    私は、パフォーマンス・アクセシビリティ・デザイン性の3つを軸に、ユーザーが直感的に操作できるWeb体験を設計・開発するフロントエンドエンジニアです。
                  </p>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    ReactやNext.jsなどのモダンフレームワークを活用し、クリーンで保守性の高いコードを書くことを心がけています。アニメーションやインタラクションによる表現にも強みがあり、GSAPやIntersection
                    Observerを使った演出で、印象的で記憶に残るUIを実現します。
                  </p>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    また、SEOやパフォーマンスチューニング、アクセシビリティ対応といった表層だけではない品質向上にも注力。ECサイトやコーポレートサイトの制作・運用経験を通して、デザインと技術の両面から課題解決に取り組んできました。
                  </p>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    「見た目の美しさ」と「使いやすさ」、そして「動作の軽快さ」が両立したWebサイトを提供することが、私の使命です。
                  </p>
                </div>
              </div>

              <div className="pt-8">
                <h4 className="text-xl font-medium text-black mb-6 text-display uppercase tracking-tight">
                  Technical Expertise
                </h4>
                <div className="space-y-6">
                  <div>
                    <h5 className="text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                      Frontend Frameworks
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'Next.js', 'Remix'].map((skill) => (
                        <span
                          key={skill}
                          className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                      Languages
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {['TypeScript', 'JavaScript (ES6+)'].map((skill) => (
                        <span
                          key={skill}
                          className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                      Styling
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {['Tailwind CSS', 'SCSS', 'shadcn/ui'].map((skill) => (
                        <span
                          key={skill}
                          className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                      Animations
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {['GSAP', 'Framer Motion', 'Intersection Observer'].map((skill) => (
                        <span
                          key={skill}
                          className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                      Design Tools
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {['Figma', 'Adobe Photoshop / XD'].map((skill) => (
                        <span
                          key={skill}
                          className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                      Backend & APIs
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {['Node.js', 'Hono', 'Cloudflare Workers', 'microCMS', 'REST / GraphQL'].map(
                        (skill) => (
                          <span
                            key={skill}
                            className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                      Other Skills
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Performance tuning',
                        'SEO best practices',
                        'CI/CD (GitHub Actions)',
                        'Cloudflare deployment',
                      ].map((skill) => (
                        <span
                          key={skill}
                          className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative order-1 md:order-2">
              <div ref={imageRef} className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-black/2 to-transparent rounded-2xl"></div>
                <div className="absolute inset-4 border border-black/20 rounded-xl"></div>
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  <Image
                    src="/assets/images/my-image.jpg"
                    alt="Yunosuke Yoshino - Frontend Developer"
                    fill
                    className="object-cover object-[-70px]"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
