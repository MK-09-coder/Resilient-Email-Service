# Resilient Email Service (JavaScript)

A fault‑tolerant, provider‑agnostic email sender written in modern **ES modules** with zero external SMTP dependencies.

---

## Features
* Retry with exponential back-off
* Automatic provider fallback (SendGridMock → SESMock)
* Idempotency (skip duplicates)
* Token-bucket rate limiting (20 req / sec)
* Per-message status endpoint
* Circuit-breaker + in-memory queue (bonus)
* 100 % unit-testable (Jest)
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
