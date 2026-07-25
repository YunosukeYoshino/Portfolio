import type { APIRoute } from 'astro'
import { z } from 'zod'
import { contactSchema, sendResendEmail } from '@/lib/server/contactMail'

// on-demand SSR（Cloudflare Workers 上で動かす）
export const prerender = false

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured')
    }

    const emailResult = await sendResendEmail(apiKey, validatedData)

    return new Response(JSON.stringify({ message: 'メールを送信しました', id: emailResult.id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    })
  } catch (error) {
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

export const OPTIONS: APIRoute = async () =>
  new Response(null, {
    status: 200,
    headers: corsHeaders,
  })
