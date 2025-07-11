export default class CircuitBreaker {
  #failures = 0;
  #openedAt = 0;
  constructor(threshold = 3, cooldownMs = 15_000) {
    this.threshold = threshold;
    this.cooldownMs = cooldownMs;
  }
  get open() {
    if (this.#failures < this.threshold) return false;
    if (Date.now() - this.#openedAt > this.cooldownMs) {
      this.reset();
      return false;
    }
    return true;
  }
  success() { this.reset(); }
  failure() {
    this.#failures += 1;
    if (this.#failures >= this.threshold) this.#openedAt = Date.now();
  }
  reset() { this.#failures = 0; }
}
