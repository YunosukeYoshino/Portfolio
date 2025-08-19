'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'お名前を入力してください')
    .max(100, 'お名前は100文字以内で入力してください'),
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください'),
  company: z.string().optional(),
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

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

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
          ? 'https://yunosukeyoshino.com/api/contact'
          : '/api/contact'

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
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-bold uppercase tracking-wider mb-2">
            NAME *
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className="w-full px-4 py-3 bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
            placeholder="山田 太郎"
          />
          {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-bold uppercase tracking-wider mb-2">
            EMAIL *
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="w-full px-4 py-3 bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
            placeholder="example@yunosukeyoshino.com"
          />
          {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label
            htmlFor="company"
            className="block text-sm font-bold uppercase tracking-wider mb-2"
          >
            COMPANY
          </label>
          <input
            {...register('company')}
            type="text"
            id="company"
            className="w-full px-4 py-3 bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
            placeholder="株式会社Example"
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-bold uppercase tracking-wider mb-2"
          >
            SUBJECT *
          </label>
          <input
            {...register('subject')}
            type="text"
            id="subject"
            className="w-full px-4 py-3 bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
            placeholder="お問い合わせの件名"
          />
          {errors.subject && <p className="mt-2 text-sm text-red-600">{errors.subject.message}</p>}
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-bold uppercase tracking-wider mb-2"
          >
            MESSAGE *
          </label>
          <textarea
            {...register('message')}
            id="message"
            rows={6}
            className="w-full px-4 py-3 bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors resize-none"
            placeholder="お問い合わせ内容をご記入ください"
          />
          {errors.message && <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>}
        </div>

        {submitStatus.type && (
          <div
            className={`p-4 border-2 ${
              submitStatus.type === 'success'
                ? 'border-green-600 bg-green-50 text-green-800'
                : 'border-red-600 bg-red-50 text-red-800'
            }`}
          >
            <p className="text-sm font-medium">{submitStatus.message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-8 py-4 bg-black text-white font-bold uppercase tracking-wider border-2 border-black hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
        </button>
      </form>
    </div>
  )
}
