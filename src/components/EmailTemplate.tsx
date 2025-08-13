import type * as React from 'react'

interface EmailTemplateProps {
  name: string
  email: string
  company?: string
  subject: string
  message: string
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  name,
  email,
  company,
  subject,
  message,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
    <div style={{ backgroundColor: '#000', color: '#fff', padding: '20px' }}>
      <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', letterSpacing: '0.05em' }}>
        新しいお問い合わせ
      </h1>
    </div>

    <div style={{ padding: '30px', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#333' }}>{subject}</h2>

      <div style={{ backgroundColor: '#fff', padding: '20px', border: '2px solid #000' }}>
        <div style={{ marginBottom: '15px' }}>
          <strong style={{ display: 'inline-block', width: '100px', color: '#666' }}>
            お名前:
          </strong>
          <span style={{ color: '#333' }}>{name}</span>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <strong style={{ display: 'inline-block', width: '100px', color: '#666' }}>
            メール:
          </strong>
          <a href={`mailto:${email}`} style={{ color: '#0066cc' }}>
            {email}
          </a>
        </div>

        {company && (
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ display: 'inline-block', width: '100px', color: '#666' }}>
              会社名:
            </strong>
            <span style={{ color: '#333' }}>{company}</span>
          </div>
        )}

        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
          <strong style={{ display: 'block', marginBottom: '10px', color: '#666' }}>
            メッセージ:
          </strong>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#333' }}>{message}</p>
        </div>
      </div>

      <div
        style={{
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#f0f0f0',
          fontSize: '12px',
          color: '#666',
        }}
      >
        <p style={{ margin: 0 }}>
          このメールは yunosukeyoshino.com のコンタクトフォームから送信されました。
        </p>
      </div>
    </div>
  </div>
)
