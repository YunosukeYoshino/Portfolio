import { z } from 'zod'

export interface Env {
  RESEND_API_KEY: string
  DISCORD_WEBHOOK_URL?: string
}

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  company: z.string().optional(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
})

async function sendResendEmail(apiKey: string, data: z.infer<typeof contactSchema>) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #000; color: #fff; padding: 20px;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.05em;">
          新しいお問い合わせ
        </h1>
      </div>

      <div style="padding: 30px; background-color: #f9f9f9;">
        <h2 style="font-size: 20px; margin-bottom: 20px; color: #333;">
          ${data.subject}
        </h2>

        <div style="background-color: #fff; padding: 20px; border: 2px solid #000;">
          <div style="margin-bottom: 15px;">
            <strong style="display: inline-block; width: 100px; color: #666;">お名前:</strong>
            <span style="color: #333;">${data.name}</span>
          </div>

          <div style="margin-bottom: 15px;">
            <strong style="display: inline-block; width: 100px; color: #666;">メール:</strong>
            <a href="mailto:${data.email}" style="color: #0066cc;">${data.email}</a>
          </div>

          ${
            data.company
              ? `
          <div style="margin-bottom: 15px;">
            <strong style="display: inline-block; width: 100px; color: #666;">会社名:</strong>
            <span style="color: #333;">${data.company}</span>
          </div>
          `
              : ''
          }

          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
            <strong style="display: block; margin-bottom: 10px; color: #666;">メッセージ:</strong>
            <p style="white-space: pre-wrap; line-height: 1.6; color: #333;">${data.message}</p>
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

  const confirmationHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #000; color: #fff; padding: 20px;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.05em;">
          お問い合わせありがとうございます
        </h1>
      </div>

      <div style="padding: 30px; background-color: #f9f9f9;">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          ${data.name} 様
        </p>

        <p style="font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 20px;">
          この度はお問い合わせいただき、誠にありがとうございます。<br>
          以下の内容でお問い合わせを承りました。
        </p>

        <div style="background-color: #fff; padding: 20px; border: 2px solid #000; margin-bottom: 20px;">
          <h3 style="font-size: 16px; color: #333; margin-bottom: 15px;">お問い合わせ内容</h3>

          <div style="margin-bottom: 10px;">
            <strong style="color: #666;">件名:</strong>
            <span style="color: #333;">${data.subject}</span>
          </div>

          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
            <strong style="display: block; margin-bottom: 10px; color: #666;">メッセージ:</strong>
            <p style="white-space: pre-wrap; line-height: 1.6; color: #333; margin: 0;">${data.message}</p>
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

  // Send main email
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
    const error = await mainResponse.text()
    throw new Error(`Failed to send main email: ${error}`)
  }

  // Send confirmation email
  const confirmResponse = await fetch('https://api.resend.com/emails', {
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

  if (!confirmResponse.ok) {
    console.error('Failed to send confirmation email')
  }

  const result = await mainResponse.json()
  return result
}

async function sendDiscordNotification(webhookUrl: string, data: z.infer<typeof contactSchema>) {
  const discordPayload = {
    embeds: [
      {
        title: '📨 新しいお問い合わせ',
        color: 0x000000,
        fields: [
          {
            name: '👤 お名前',
            value: data.name,
            inline: true,
          },
          {
            name: '📧 メールアドレス',
            value: data.email,
            inline: true,
          },
          {
            name: '🏢 会社名',
            value: data.company || 'なし',
            inline: true,
          },
          {
            name: '📝 件名',
            value: data.subject,
            inline: false,
          },
          {
            name: '💬 メッセージ',
            value: data.message.length > 1024 ? `${data.message.substring(0, 1021)}...` : data.message,
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

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordPayload),
    })
  } catch (error) {
    console.error('Discord webhook error:', error)
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  try {
    const body = await context.request.json()
    const validatedData = contactSchema.parse(body)

    // Send emails via Resend
    const emailResult = await sendResendEmail(context.env.RESEND_API_KEY, validatedData)

    // Send Discord notification
    if (context.env.DISCORD_WEBHOOK_URL) {
      await sendDiscordNotification(context.env.DISCORD_WEBHOOK_URL, validatedData)
    }

    return new Response(
      JSON.stringify({ message: 'メールを送信しました', id: emailResult.id }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  } catch (error) {
    console.error('Contact form error:', error)

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: '入力データが無効です', details: error.issues }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      )
    }

    return new Response(JSON.stringify({ error: 'サーバーエラーが発生しました' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    })
  }
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}