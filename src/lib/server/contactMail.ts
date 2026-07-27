import type { ContactPayload } from '@/lib/contactSchema'
import { contactBaseSchema } from '@/lib/contactSchema'

export const contactSchema = contactBaseSchema
export type { ContactPayload }

/** ユーザー入力を HTML 本文に安全に埋め込むための最小限のエスケープ。 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Resend 経由で管理者宛て（info@）と差出人宛て（確認メール）の 2 通を送る。
 * Astro API route (`src/pages/api/contact.ts`) から呼ばれる。
 */
export async function sendResendEmail(
  apiKey: string,
  data: ContactPayload
): Promise<{ id: string }> {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #000; color: #fff; padding: 20px;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.05em;">
          新しいお問い合わせ
        </h1>
      </div>

      <div style="padding: 30px; background-color: #f9f9f9;">
        <h2 style="font-size: 20px; margin-bottom: 20px; color: #333;">
          ${escapeHtml(data.subject)}
        </h2>

        <div style="background-color: #fff; padding: 20px; border: 2px solid #000;">
          <div style="margin-bottom: 15px;">
            <strong style="display: inline-block; width: 100px; color: #666;">お名前:</strong>
            <span style="color: #333;">${escapeHtml(data.name)}</span>
          </div>

          <div style="margin-bottom: 15px;">
            <strong style="display: inline-block; width: 100px; color: #666;">メール:</strong>
            <a href="mailto:${escapeHtml(data.email)}" style="color: #0066cc;">${escapeHtml(data.email)}</a>
          </div>

          ${
            data.company
              ? `
          <div style="margin-bottom: 15px;">
            <strong style="display: inline-block; width: 100px; color: #666;">会社名:</strong>
            <span style="color: #333;">${escapeHtml(data.company ?? '')}</span>
          </div>
          `
              : ''
          }

          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
            <strong style="display: block; margin-bottom: 10px; color: #666;">メッセージ:</strong>
            <p style="white-space: pre-wrap; line-height: 1.6; color: #333;">${escapeHtml(data.message)}</p>
          </div>
        </div>
      </div>
    </div>
  `

  const confirmationHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #000; color: #fff; padding: 20px;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.05em;">
          お問い合わせありがとうございます
        </h1>
      </div>

      <div style="padding: 30px; background-color: #f9f9f9;">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          ${escapeHtml(data.name)} 様
        </p>

        <p style="font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 20px;">
          この度はお問い合わせいただき、誠にありがとうございます。<br>
          以下の内容でお問い合わせを承りました。
        </p>

        <div style="background-color: #fff; padding: 20px; border: 2px solid #000; margin-bottom: 20px;">
          <h3 style="font-size: 16px; color: #333; margin-bottom: 15px;">お問い合わせ内容</h3>
          <div style="margin-bottom: 10px;">
            <strong style="color: #666;">件名:</strong>
            <span style="color: #333;">${escapeHtml(data.subject)}</span>
          </div>
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
            <strong style="display: block; margin-bottom: 10px; color: #666;">メッセージ:</strong>
            <p style="white-space: pre-wrap; line-height: 1.6; color: #333; margin: 0;">${escapeHtml(data.message)}</p>
          </div>
        </div>

        <p style="font-size: 14px; color: #666; line-height: 1.6;">
          内容を確認次第、2-3営業日以内にご返信させていただきます。<br>
          今しばらくお待ちください。
        </p>
      </div>
    </div>
  `

  const mainResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: 'Yoshino Yunosuke <noreply@yunosukeyoshino.com>',
      to: ['info@yunosukeyoshino.com'],
      reply_to: data.email,
      subject: `[お問い合わせ] ${data.subject}`,
      html: htmlContent,
    }),
  })

  if (!mainResponse.ok) {
    const errorText = await mainResponse.text()
    throw new Error(`Failed to send main email: ${errorText}`)
  }

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: 'Yoshino Yunosuke <noreply@yunosukeyoshino.com>',
      to: [data.email],
      subject: '【受付完了】お問い合わせありがとうございます',
      reply_to: 'info@yunosukeyoshino.com',
      html: confirmationHtml,
    }),
  })

  return (await mainResponse.json()) as { id: string }
}
