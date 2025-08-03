export default function About() {
  return (
    <section className="p-about py-16 md:py-24 lg:py-32 bg-gray-50" id="about">
      <div className="container-custom">
        <header className="text-center mb-12">
          <h2 className="p-sectionUpperText text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About
          </h2>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Hello, I'm Yunosuke</h3>
              <p className="text-gray-600 leading-relaxed">
                フロントエンド開発とUI/UXデザインを専門とするエンジニアです。
                ユーザーにとって使いやすく、美しいWebサイトの制作を心がけています。
              </p>
              <p className="text-gray-600 leading-relaxed">
                モダンなWeb技術を活用し、パフォーマンスとアクセシビリティを重視した
                高品質なデジタル体験の創造に取り組んでいます。
              </p>
              <div className="pt-4">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    'React',
                    'Next.js',
                    'TypeScript',
                    'Tailwind CSS',
                    'GSAP',
                    'Figma',
                    'Adobe Creative Suite',
                    'Node.js',
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-gray-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-64 h-64 mx-auto bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full opacity-20"></div>
              <p className="text-sm text-gray-500 mt-4">Coming Soon: Profile Image</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
