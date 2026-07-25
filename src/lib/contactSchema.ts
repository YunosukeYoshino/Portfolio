import { z } from 'zod'

/**
 * 問い合わせフォームのバリデーションスキーマ（制約のみ・メッセージなし）。
 *
 * サーバー (API route の parse) とクライアント (ContactForm) で共有し、
 * フィールド定義と制約値の二重管理を防ぐ。UI 向けの日本語メッセージは
 * クライアント側で extend して付与する。
 */
export const contactBaseSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  company: z.string().optional(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
})

export type ContactPayload = z.infer<typeof contactBaseSchema>
