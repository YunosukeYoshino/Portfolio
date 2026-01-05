/**
 * microCMS API Client
 *
 * Infrastructure層: 外部APIとの通信を担当
 * Domain層から分離された具体的な実装詳細
 */

export interface MicroCMSConfig {
  readonly serviceDomain: string
  readonly apiKey: string
  readonly baseUrl: string
  readonly isDevelopment: boolean
  readonly hasPlaceholderCredentials: boolean
}

/**
 * microCMS APIクライアント
 * API設定とHTTPリクエストをカプセル化
 */
export class MicroCMSClient {
  private config: MicroCMSConfig | null = null

  /**
   * API設定を遅延取得（サーバーサイド環境変数用）
   */
  private getConfig(): MicroCMSConfig {
    if (this.config) return this.config

    const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN
    const apiKey = process.env.MICROCMS_API_KEY
    const isDevelopment = import.meta.env.DEV
    const hasPlaceholderCredentials =
      serviceDomain === 'placeholder-domain' || apiKey === 'placeholder-api-key'

    if (!serviceDomain && !isDevelopment) {
      throw new Error('MICROCMS_SERVICE_DOMAIN is required')
    }

    if (!apiKey && !isDevelopment) {
      throw new Error('MICROCMS_API_KEY is required')
    }

    this.config = {
      serviceDomain: serviceDomain || 'placeholder-domain',
      apiKey: apiKey || 'placeholder-api-key',
      baseUrl: serviceDomain ? `https://${serviceDomain}/api/v1` : '',
      isDevelopment,
      hasPlaceholderCredentials: !serviceDomain || !apiKey || hasPlaceholderCredentials,
    }

    return this.config
  }

  /**
   * モックデータを使用すべきか判定
   */
  shouldUseMock(): boolean {
    const config = this.getConfig()
    const isBuildWithPlaceholders = import.meta.env.PROD && config.hasPlaceholderCredentials
    return (config.isDevelopment && config.hasPlaceholderCredentials) || isBuildWithPlaceholders
  }

  /**
   * 開発環境か判定
   */
  isDevelopment(): boolean {
    return this.getConfig().isDevelopment
  }

  /**
   * APIリクエストを実行
   */
  async request<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>
  ): Promise<T> {
    const config = this.getConfig()
    const url = new URL(`${config.baseUrl}/${endpoint}`)

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      }
    }

    const response = await fetch(url.toString(), {
      headers: {
        'X-MICROCMS-API-KEY': config.apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`microCMS API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }
}
