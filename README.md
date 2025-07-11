# Resilient Email Service (JavaScript)

A fault‑tolerant, provider‑agnostic email sender written in modern **ES modules** with zero external SMTP dependencies.

---

## Feature Matrix

| Capability                      | Implemented? | Notes                                           |
| ------------------------------- | ------------ | ----------------------------------------------- |
| Retry with exponential back‑off | ✔            | 100 ms → 200 ms → 400 ms (default 3 attempts)   |
| Automatic provider fallback     | ✔            | Ordered array: **SendGridMock → SESMock**       |
| Idempotency                     | ✔            | Duplicate `id` skipped via in‑memory `Set`      |
| Rate limiting                   | ✔            | Token‑bucket: *20 requests/second*              |
| Per‑message status API          | ✔            | `GET /status/:id` returns live state            |
| Circuit breaker (bonus)         | ✔            | Opens after 3 consecutive failures per provider |
| In‑memory queue (bonus)         | ✔            | Optional FIFO; background worker loop           |
| Simple logging (bonus)          | ✔            | Console logs; swap to Pino/Winston in one line  |
| 100 % unit‑testable             | ✔            | Jest test‑suite passes (`npm test`)             |

---

## Quick Start (Local)

```bash
git clone https://github.com/<your-user>/resilient-email-service.git
cd resilient-email-service
npm install

npm run dev

# 3 Send an email
curl -X POST http://localhost:3000/send-email \
     -H "Content-Type: application/json" \
     -d '{"to":"me@example.com","subject":"Hi","html":"<p>Hello</p>"}'

# 4 Check status (replace <id>)
curl http://localhost:3000/status/<id>
```

Default routes

```
POST /send-email        # queue or direct send
GET  /status/:id        # SENT_WITH_* | RATE_LIMITED | DUPLICATE_SKIP ...
GET  /                  # Health‑check = "Email service is up"
```

---

## Live Demo

**Site deployed at:** [https://resilient-email-service-bgv7.onrender.com](https://resilient-email-service-bgv7.onrender.com)

Try it in one line:

```bash
curl -X POST https://resilient-email-service-bgv7.onrender.com/send-email \
     -H "Content-Type: application/json" \
     -d '{"to":"demo@example.com","subject":"Render Test","html":"<p>Hello</p>"}'
```

---

## Running Tests

```bash
npm test
```

All tests should pass:

```
 PASS  test/emailService.test.js
  ✓ falls back to second provider (XX ms)
  ✓ enforces rate limiting (X ms)
```
---