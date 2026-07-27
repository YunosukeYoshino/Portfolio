'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { contactBaseSchema } from '@/lib/contactSchema'

/**
 * サーバー (API route) と共通の base スキーマを extend し、
 * UI 向けの日本語メッセージを付与する。制約値（min/max）は base 側が SSOT。
 */
const contactSchema = contactBaseSchema.extend({
  name: z
    .string()
    .min(1, 'お名前を入力してください')
    .max(100, 'お名前は100文字以内で入力してください'),
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください'),
  subject: z
    .string()
    .min(1, '件名を入力してください')
    .max(200, '件名は200文字以内で入力してください'),
  message: z
    .string()
    .min(1, 'メッセージを入力してください')
    .max(1000, 'メッセージは1000文字以内で入力してください'),
})

type ContactFormData = z.infer<typeof contactSchema>

type SubmitStatus =
  | { readonly type: 'success'; readonly message: string }
  | { readonly type: 'error'; readonly message: string }
  | { readonly type: null; readonly message: '' }

const fieldClass =
  'w-full border-b border-rule bg-transparent py-2.5 text-base text-ink transition-colors placeholder:text-ink-faint/60 focus:border-ink focus:outline-none aria-invalid:border-alert'
const errorClass = 'mt-2 font-mono text-[12px] text-alert animate-fade-in'

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({ type: null, message: '' })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const apiUrl =
        process.env.NODE_ENV === 'production'
          ? 'https://yunosukeyoshino.com/api/contact/'
          : '/api/contact/'

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('送信に失敗しました')
      }

      setSubmitStatus({
        type: 'success',
        message: 'お問い合わせを送信しました。ご連絡ありがとうございます。',
      })
      reset()
    } catch (_error) {
      setSubmitStatus({
        type: 'error',
        message: '送信中にエラーが発生しました。もう一度お試しください。',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <div>
        <label htmlFor="name" className="label-mono mb-2 block">
          Name *
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          required
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className={fieldClass}
          placeholder="山田 太郎"
        />
        {errors.name && (
          <p id="name-error" className={errorClass}>
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="label-mono mb-2 block">
          Email *
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          required
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={fieldClass}
          placeholder="example@yunosukeyoshino.com"
        />
        {errors.email && (
          <p id="email-error" className={errorClass}>
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="company" className="label-mono mb-2 block">
          Company
        </label>
        <input
          {...register('company')}
          type="text"
          id="company"
          className={fieldClass}
          placeholder="株式会社Example"
        />
      </div>

      <div>
        <label htmlFor="subject" className="label-mono mb-2 block">
          Subject *
        </label>
        <input
          {...register('subject')}
          type="text"
          id="subject"
          required
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
          className={fieldClass}
          placeholder="お問い合わせの件名"
        />
        {errors.subject && (
          <p id="subject-error" className={errorClass}>
            {errors.subject.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="label-mono mb-2 block">
          Message *
        </label>
        <textarea
          {...register('message')}
          id="message"
          rows={6}
          required
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={`${fieldClass} resize-none`}
          placeholder="お問い合わせ内容をご記入ください"
        />
        {errors.message && (
          <p id="message-error" className={errorClass}>
            {errors.message.message}
          </p>
        )}
      </div>

      {submitStatus.type && (
        <p
          role="alert"
          className={`border-l-2 py-2 pl-4 text-[15px] animate-fade-in-up ${
            submitStatus.type === 'success'
              ? 'border-affirm text-affirm'
              : 'border-alert text-alert'
          }`}
        >
          {submitStatus.message}
        </p>
      )}

      <input
        type="text"
        {...register('website')}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        placeholder="Leave this field empty"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="border border-ink px-6 py-2.5 font-mono text-[13px] tracking-[0.08em] uppercase transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isSubmitting ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
