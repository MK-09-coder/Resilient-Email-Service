# Resilient Email Service (JavaScript)

A fault-tolerant email sender written in plain ES modules.

## Features
* Retry with exponential back-off
* Automatic provider fallback (SendGridMock → SESMock)
* Idempotency (skip duplicates)
* Token-bucket rate limiting (20 req / sec)
* Per-message status endpoint
* Circuit-breaker + in-memory queue (bonus)
* 100 % unit-testable (Jest)

## Quick start
```bash
git clone https://github.com/<you>/email-service-js
cd email-service-js
npm install
npm run dev
