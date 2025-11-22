// doomclock.js
// Plain JS DoomClock class – no HTML in here.

class DoomClock {
  constructor({
    name = "Doom ⏳",
    start = 100,
    milestonePercents = null,
    onZero = null,
    logger = null
  } = {}) {
    this.name = name;
    this.start = Number(start);
    this.ticks = this.start;
    this.onZero = onZero;
    this.logger = typeof logger === "function" ? logger : (msg => console.log(msg));
    this._hit = new Set();
    this.resolved = false;

    // Convert percentage milestones (75, 50, 25) to numeric thresholds
    this.milestones = {};
    if (milestonePercents) {
      for (const [percentStr, fn] of Object.entries(milestonePercents)) {
        const percent = Number(percentStr);
        const threshold = Math.floor(this.start * (percent / 100));
        const bounded = Math.max(1, Math.min(this.start, threshold));
        this.milestones[bounded] = fn;
      }
    }
  }

  _emitMessages(messages, log) {
    if (!messages || messages.length === 0) return;
    if (Array.isArray(log)) {
      messages.forEach(msg => log.push(msg));
    } else {
      messages.forEach(msg => this.logger(msg));
    }
  }

  countdown(n = 1, { log = null, reason = null } = {}) {
    const prev = this.ticks;
    this.ticks = Math.max(0, this.ticks - Number(n));

    const tempLog = [];
    const targetLog = log || tempLog;

    if (reason) {
      targetLog.push(`[Doom -${n}] ${reason}`);
    }

    const thresholds = Object.keys(this.milestones)
      .map(Number)
      .sort((a, b) => b - a);

    for (const threshold of thresholds) {
      if (prev >= threshold && this.ticks < threshold && !this._hit.has(threshold)) {
        this._hit.add(threshold);
        const cb = this.milestones[threshold];
        if (typeof cb === "function") cb({}, [], targetLog);
      }
    }

    let zeroTriggered = false;
    if (!this.resolved && this.ticks === 0) {
      this.resolved = true;
      if (typeof this.onZero === "function") {
        this.onZero({}, [], targetLog);
      }
      zeroTriggered = true;
    }

    if (!log) this._emitMessages(tempLog, null);
    return zeroTriggered;
  }

  addTime(n = 1, { log = null, reason = null } = {}) {
    this.ticks = Math.min(this.start, this.ticks + Number(n));
    const tempLog = [];
    const targetLog = log || tempLog;
    if (reason) targetLog.push(`[Doom +${n}] ${reason}`);
    if (!log) this._emitMessages(tempLog, null);
  }

  reset() {
    this.ticks = this.start;
    this._hit.clear();
    this.resolved = false;
  }
}

// make it accessible to other scripts
window.DoomClock = DoomClock;
