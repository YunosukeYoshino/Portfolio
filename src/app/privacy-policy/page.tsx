import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'Yunosuke Yoshinoのポートフォリオサイトのプライバシーポリシー',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="container-custom py-20 pt-32">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-display mb-12 text-4xl font-bold">プライバシーポリシー</h1>

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
                <a
                  href="mailto:yunosukeyoshino@gmail.com"
                  className="text-blue-600 transition-colors hover:text-blue-800"
                >
                  yunosukeyoshino@gmail.com
                </a>
                までお気軽にお問い合わせください。
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
