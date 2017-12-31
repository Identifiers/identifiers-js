export class ImmutableDate extends Date {

  constructor(ts: number) {
    super(ts);
  }

  private immutableError(): Error {
    return new Error("this Date instance is immutable.");
  }

  setDate(date: number): never {
    throw this.immutableError();
  }

  setFullYear(year: number, month?: number, date?: number): never {
    throw this.immutableError();
  }

  setHours(hours: number, min?: number, sec?: number, ms?: number): never {
    throw this.immutableError();
  }

  setMilliseconds(ms: number): never {
    throw this.immutableError();
  }

  setMinutes(min: number, sec?: number, ms?: number): never {
    throw this.immutableError();
  }

  setMonth(month: number, date?: number): never {
    throw this.immutableError();
  }

  setSeconds(sec: number, ms?: number): never {
    throw this.immutableError();
  }

  setTime(time: number): never {
    throw this.immutableError();
  }

  setUTCDate(date: number): never {
    throw this.immutableError();
  }

  setUTCFullYear(year: number, month?: number, date?: number): never {
    throw this.immutableError();
  }

  setUTCHours(hours: number, min?: number, sec?: number, ms?: number): never {
    throw this.immutableError();
  }

  setUTCMilliseconds(ms: number): never {
    throw this.immutableError();
  }

  setUTCMinutes(min: number, sec?: number, ms?: number): never {
    throw this.immutableError();
  }

  setUTCMonth(month: number, date?: number): never {
    throw this.immutableError();
  }

  setUTCSeconds(sec: number, ms?: number): never {
    throw this.immutableError();
  }
}