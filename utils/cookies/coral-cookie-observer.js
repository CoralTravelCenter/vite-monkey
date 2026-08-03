export class CoralCookieObserver {
  constructor(key, options = {}) {
    if (typeof key !== "string" || !key) {
      throw new Error(
        "CoralCookieObserver: cookie key must be a non-empty string.",
      );
    }

    this.key = key;
    this.delay = options.delay || 1000;
    this.lastValue = this.getCookieValue();
    this.callbacks = [];
    this.timer = null;
  }

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => this.check(), this.delay);
  }

  stop() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  }

  onChange(callback) {
    if (typeof callback === "function") {
      this.callbacks.push(callback);
    }
  }

  check() {
    const currentValue = this.getCookieValue();
    if (currentValue !== this.lastValue) {
      this.callbacks.forEach((cb) => cb(currentValue, this.lastValue));
      this.lastValue = currentValue;
    }
  }

  getCookieValue() {
    const cookies = document.cookie.split(";");
    for (const c of cookies) {
      const [k, ...v] = c.trim().split("=");
      if (k === this.key) {
        return decodeURIComponent(v.join("="));
      }
    }
    return undefined;
  }
}
