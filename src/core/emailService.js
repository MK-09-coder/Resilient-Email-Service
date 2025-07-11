import RateLimiter from './rateLimiter.js';
import CircuitBreaker from './circuitBreaker.js';

export default class EmailService {
  #sent = new Set();
  #status = new Map();
  #limiter = new RateLimiter(20, 20);
  #breakers;
  constructor(providers, maxRetries = 3, queue = null) {
    this.providers = providers;
    this.maxRetries = maxRetries;
    this.queue = queue;
    this.#breakers = new Map(providers.map(p => [p.name, new CircuitBreaker()]));
  }

  async send(email) {
    if (this.queue) {
      this.queue.push(() => this.#sendNow(email));
      return { queued: true };
    }
    return this.#sendNow(email);
  }

  getStatus(id) { return this.#status.get(id) || 'UNKNOWN_ID'; }

  async runQueueLoop() {
    if (!this.queue) return;
    while (true) {
      const task = this.queue.pop();
      if (task) await task();
      else await new Promise(r => setTimeout(r, 200));
    }
  }

  async #sendNow(email) {
    if (this.#sent.has(email.id)) {
      this.#status.set(email.id, 'DUPLICATE_SKIP');
      return;
    }
    if (!this.#limiter.consume()) {
      this.#status.set(email.id, 'RATE_LIMITED');
      throw new Error('Rate limit exceeded');
    }

    for (const provider of this.providers) {
      const breaker = this.#breakers.get(provider.name);
      if (breaker.open) continue;

      for (let attempt = 0; attempt < this.maxRetries; attempt++) {
        try {
          await provider.send(email);
          breaker.success();
          this.#status.set(email.id, `SENT_WITH_${provider.name}`);
          this.#sent.add(email.id);
          return;
        } catch (err) {
          breaker.failure();
          const wait = 100 * 2 ** attempt;
          await new Promise(r => setTimeout(r, wait));
        }
      }
    }
    this.#status.set(email.id, 'FAILED_ALL_PROVIDERS');
    throw new Error('All providers failed');
  }
}
