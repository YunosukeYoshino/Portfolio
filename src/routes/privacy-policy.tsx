import { createFileRoute } from '@tanstack/react-router'
import { HydratedEmailLink } from '@/components/common/HydratedEmail'
import SitePage from '@/components/layout/SitePage'
import { createStandardHead } from '@/lib/siteMetadata'

export const Route = createFileRoute('/privacy-policy')({
  head: () =>
    createStandardHead({
      title: 'プライバシーポリシー | Yunosuke Yoshino',
      path: '/privacy-policy',
      description: 'Yunosuke Yoshinoのポートフォリオサイトのプライバシーポリシー',
      robots: 'noindex, follow',
    }),
  component: PrivacyPolicyPage,
})

function PrivacyPolicyPage() {
  return (
    <SitePage mainClassName="min-h-screen bg-white pt-40 pb-24 md:pt-48 md:pb-32">
      <div className="container-custom">
        <div className="mx-auto max-w-4xl">
          <header className="mb-14 md:mb-18">
            <span className="mb-6 inline-block border-b border-black/15 pb-2 font-mono text-xs tracking-[0.22em] text-gray-500 uppercase">
              Privacy Policy
            </span>
            <h1 className="text-display mb-6 text-4xl font-bold tracking-tight md:text-5xl">
              プライバシーポリシー
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
              本サイトで取得する情報と、その利用目的、第三者サービスの取り扱いについてまとめています。
            </p>
          </header>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-semibold">収集する情報</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                当サイトは主にポートフォリオサイトです。訪問者から収集する情報は最小限に留めており、以下の情報を収集します：
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700">
                <li>基本的なアクセス解析データ（ページビュー、訪問者数、大まかな地域情報）</li>
                <li>お問い合わせフォームやメールを通じて自発的に提供される情報</li>
                <li>セキュリティ目的でのブラウザタイプやIPアドレスなどの技術情報</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-semibold">情報の利用目的</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                収集した限定的な情報は、以下の目的でのみ使用します：
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700">
                <li>ウェブサイトの利用状況の把握とユーザーエクスペリエンスの向上</li>
                <li>お問い合わせやコミュニケーションへの対応</li>
                <li>ウェブサイトのセキュリティと機能の維持</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-semibold">Google Analyticsの使用</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                当サイトでは、ウェブサイトの利用状況を分析するためにGoogle
                Analyticsを使用しています。Google Analyticsは以下の情報を収集します：
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700">
                <li>ページビュー数、セッション数、滞在時間</li>
                <li>デバイス情報（デバイスタイプ、OS、ブラウザ）</li>
                <li>大まかな地理的位置情報（国・地域レベル）</li>
                <li>リファラー情報（どこから当サイトにアクセスしたか）</li>
              </ul>
              <p className="mb-4 leading-relaxed text-gray-700">
                これらの情報は匿名化されており、個人を特定することはできません。Google
                Analyticsの詳細については、
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 transition-colors hover:text-blue-800"
                >
                  Googleのプライバシーポリシー
                </a>
                をご確認ください。
              </p>
            </section>

            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-semibold">第三者との情報共有</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                個人情報を第三者に販売、取引、または譲渡することはありません。ただし、上記のGoogle
                Analyticsなど、ウェブサイトの基本的な統計情報を取得するための第三者サービスを利用する場合があります。
              </p>
            </section>

            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-semibold">Cookieについて</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                当サイトでは、ブラウジング体験の向上と基本的な解析情報の収集のためにCookieを使用する場合があります。ほとんどのブラウザでは、設定でCookieの制御が可能です。
              </p>
            </section>

            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-semibold">お問い合わせ</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                このプライバシーポリシーやお客様のデータに関してご質問がございましたら、
                <HydratedEmailLink
                  user="info"
                  domain="yunosukeyoshino.com"
                  placeholder="info [at] yunosukeyoshino dot com"
                  className="text-blue-600 transition-colors hover:text-blue-800"
                />
                までお気軽にお問い合わせください。
              </p>
            </section>
          </div>
        </div>
      </div>
    </SitePage>
  )
}
