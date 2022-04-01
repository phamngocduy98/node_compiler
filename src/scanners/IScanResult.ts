export class ScanResult {
  constructor(private type: string, private value?: any) {}
  toString() {
    return `${this.type}${this.value != null ? `(${this.value})` : ""}`;
  }
}
