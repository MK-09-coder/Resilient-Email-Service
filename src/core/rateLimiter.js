export default class RateLimiter {
  #tokens;
  #lastRefill;
  constructor(capacity = 20, refillPerSec = 20) {
    this.capacity = capacity;
    this.refillPerSec = refillPerSec;
    this.#tokens = capacity;
    this.#lastRefill = Date.now();
  }
  consume(n = 1) {
    this.#refill();
    if (this.#tokens < n) return false;
    this.#tokens -= n;
    return true;
  }
  #refill() {
    const now = Date.now();
    const elapsed = (now - this.#lastRefill) / 1000;
    const refill = Math.floor(elapsed * this.refillPerSec);
    if (refill) {
      this.#tokens = Math.min(this.capacity, this.#tokens + refill);
      this.#lastRefill = now;
    }
  }
}
