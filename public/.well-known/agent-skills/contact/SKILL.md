---
name: contact
description: Send a contact message to Yunosuke Yoshino via the portfolio contact form API. Use this skill when an agent or user wants to get in touch, inquire about collaboration, request a quote, or ask any question addressed to Yunosuke Yoshino.
---

# Contact Yunosuke Yoshino

Send a message via the contact form API. A confirmation email is automatically delivered to the sender.

## Endpoint

```
POST https://yunosukeyoshino.com/api/contact
Content-Type: application/json
```

## Request body

| Field | Type | Required | Constraints |
|---|---|---|---|
| `name` | string | yes | 1–100 characters |
| `email` | string | yes | Valid email address |
| `subject` | string | yes | 1–200 characters |
| `message` | string | yes | 1–1000 characters |
| `company` | string | no | Organisation name (optional) |

## Example

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "Front-end collaboration inquiry",
  "message": "Hi Yunosuke, I'd love to discuss a potential project together."
}
```

## Responses

| Status | Body |
|---|---|
| 200 OK | `{"message": "メールを送信しました", "id": "<resend-id>"}` |
| 400 Bad Request | `{"error": "入力データが無効です", "details": [...zod issues]}` |
| 500 Internal Server Error | `{"error": "サーバーエラーが発生しました"}` |

On success, both Yunosuke and the sender receive an email automatically.
