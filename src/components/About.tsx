import Image from 'next/image'

export default function About() {
  return (
    <section className="p-about py-24 md:py-32 bg-gray-50 border-t border-black/10" id="about">
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
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-black mb-6 text-display uppercase tracking-tight">
                  Hello, I'm Yunosuke
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    フロントエンド開発とUI/UXデザインを専門とするエンジニアです。
                    ユーザーにとって使いやすく、美しいWebサイトの制作を心がけています。
                  </p>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    モダンなWeb技術を活用し、パフォーマンスとアクセシビリティを重視した
                    高品質なデジタル体験の創造に取り組んでいます。
                  </p>
                </div>
              </div>

              <div className="pt-8">
                <h4 className="text-xl font-medium text-black mb-6 text-display uppercase tracking-tight">
                  Technical Expertise
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    'React / Next.js',
                    'TypeScript',
                    'Tailwind CSS',
                    'GSAP',
                    'Figma',
                    'Adobe Suite',
                    'Node.js',
                    'microCMS',
                  ].map((skill) => (
                    <div key={skill} className="group flex items-center space-x-3 py-2">
                      <div className="w-1 h-1 bg-black rounded-full group-hover:scale-150 transition-transform"></div>
                      <span className="text-gray-700 group-hover:text-black transition-colors text-sm font-medium">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative w-full aspect-square max-w-md mx-auto">
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
