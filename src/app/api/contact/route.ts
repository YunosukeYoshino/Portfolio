import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  company: z.string().optional(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = contactSchema.parse(body)

    // Create HTML email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #000; color: #fff; padding: 20px;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.05em;">
            新しいお問い合わせ
          </h1>
        </div>

        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="font-size: 20px; margin-bottom: 20px; color: #333;">
            ${validatedData.subject}
          </h2>

          <div style="background-color: #fff; padding: 20px; border: 2px solid #000;">
            <div style="margin-bottom: 15px;">
              <strong style="display: inline-block; width: 100px; color: #666;">お名前:</strong>
              <span style="color: #333;">${validatedData.name}</span>
            </div>

            <div style="margin-bottom: 15px;">
              <strong style="display: inline-block; width: 100px; color: #666;">メール:</strong>
              <a href="mailto:${validatedData.email}" style="color: #0066cc;">${validatedData.email}</a>
            </div>

            ${
              validatedData.company
                ? `
            <div style="margin-bottom: 15px;">
              <strong style="display: inline-block; width: 100px; color: #666;">会社名:</strong>
              <span style="color: #333;">${validatedData.company}</span>
            </div>
            `
                : ''
            }

            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
              <strong style="display: block; margin-bottom: 10px; color: #666;">メッセージ:</strong>
              <p style="white-space: pre-wrap; line-height: 1.6; color: #333;">${validatedData.message}</p>
            </div>
          </div>

          <div style="margin-top: 30px; padding: 15px; background-color: #f0f0f0; font-size: 12px; color: #666;">
            <p style="margin: 0;">
              このメールは yunosukeyoshino.com のコンタクトフォームから送信されました。
            </p>
          </div>
        </div>
      </div>
    `

    // Send email to admin
    const { data, error } = await resend.emails.send({
      from: `Yoshino Yunosuke <noreply@yunosukeyoshino.com>`,
      to: ['info@yunosukeyoshino.com'], // 実際の受信用メールアドレス
      replyTo: validatedData.email,
      subject: `[お問い合わせ] ${validatedData.subject}`,
      html: htmlContent,
    })

    if (error) {
      // biome-ignore lint/suspicious/noConsole: Error logging needed for debugging
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'メールの送信に失敗しました' }, { status: 500 })
    }

    // Create confirmation email for sender
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #000; color: #fff; padding: 20px;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.05em;">
            お問い合わせありがとうございます
          </h1>
        </div>

        <div style="padding: 30px; background-color: #f9f9f9;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            ${validatedData.name} 様
          </p>

          <p style="font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 20px;">
            この度はお問い合わせいただき、誠にありがとうございます。<br>
            以下の内容でお問い合わせを承りました。
          </p>

          <div style="background-color: #fff; padding: 20px; border: 2px solid #000; margin-bottom: 20px;">
            <h3 style="font-size: 16px; color: #333; margin-bottom: 15px;">お問い合わせ内容</h3>

            <div style="margin-bottom: 10px;">
              <strong style="color: #666;">件名:</strong>
              <span style="color: #333;">${validatedData.subject}</span>
            </div>

            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
              <strong style="display: block; margin-bottom: 10px; color: #666;">メッセージ:</strong>
              <p style="white-space: pre-wrap; line-height: 1.6; color: #333; margin: 0;">${validatedData.message}</p>
            </div>
          </div>

          <p style="font-size: 14px; color: #666; line-height: 1.6;">
            内容を確認次第、2-3営業日以内にご返信させていただきます。<br>
            今しばらくお待ちください。
          </p>

          <div style="margin-top: 30px; padding: 15px; background-color: #f0f0f0; font-size: 12px; color: #666;">
            <p style="margin: 0 0 10px 0;">
              このメールは自動送信されています。<br>
              このメールに返信いただいても、ご返答できませんのでご了承ください。
            </p>
            <p style="margin: 0;">
              Yunosuke Yoshino<br>
              <a href="https://yunosukeyoshino.com" style="color: #0066cc;">yunosukeyoshino.com</a>
            </p>
          </div>
        </div>
      </div>
    `

    // Send confirmation email to sender
    const { error: confirmError } = await resend.emails.send({
      from: `Yoshino Yunosuke <noreply@yunosukeyoshino.com>`,
      to: [validatedData.email],
      subject: `【受付完了】お問い合わせありがとうございます`,
      replyTo: 'info@yunosukeyoshino.com',
      html: confirmationHtml,
    })

    if (confirmError) {
      // biome-ignore lint/suspicious/noConsole: Error logging needed for debugging
      console.error('Confirmation email error:', confirmError)
      // Don't fail the whole request if confirmation email fails
    }

    // Send Discord webhook notification
    const discordWebhookUrl =
      'https://discord.com/api/webhooks/1404975000318116002/UcJBOPR33OHiuFN6oZGcGQICJ0uHRVo7n9ZGqFC1IW8eLyp25ZR6qYlvBNE3CvfmE5Dd'

    try {
      const discordPayload = {
        embeds: [
          {
            title: '📨 新しいお問い合わせ',
            color: 0x000000, // Black color
            fields: [
              {
                name: '👤 お名前',
                value: validatedData.name,
                inline: true,
              },
              {
                name: '📧 メールアドレス',
                value: validatedData.email,
                inline: true,
              },
              {
                name: '🏢 会社名',
                value: validatedData.company || 'なし',
                inline: true,
              },
              {
                name: '📝 件名',
                value: validatedData.subject,
                inline: false,
              },
              {
                name: '💬 メッセージ',
                value:
                  validatedData.message.length > 1024
                    ? `${validatedData.message.substring(0, 1021)}...`
                    : validatedData.message,
                inline: false,
              },
            ],
            footer: {
              text: 'yunosukeyoshino.com Contact Form',
            },
            timestamp: new Date().toISOString(),
          },
        ],
      }

      await fetch(discordWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordPayload),
      })
    } catch (discordError) {
      // biome-ignore lint/suspicious/noConsole: Error logging needed for debugging
      console.error('Discord webhook error:', discordError)
      // Don't fail the whole request if Discord notification fails
    }

    return NextResponse.json({ message: 'メールを送信しました', id: data?.id }, { status: 200 })
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Error logging needed for debugging
    console.error('Contact form error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '入力データが無効です', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
