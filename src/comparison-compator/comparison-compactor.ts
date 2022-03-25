class Assert {
  static format(arg1: string, arg2: string, arg3: string): string {
    const start = arg1 === null ? "" : `${arg1} `;
    return `${start}expected:<${arg2}> but was:<${arg3}>`;
  }
}

class ComparisonCompactor {
  private static ELLIPSIS: string = "...";
  private static DELTA_START: string = "[";
  private static DELTA_END: string = "]";

  private fContextLength: number;
  private fExpected: string;
  private fActual: string;
  private fPrefix: number;
  private fSuffix: number;

  constructor(contextLength: number, expected: string, actual: string) {
    this.fContextLength = contextLength;
    this.fExpected = expected;
    this.fActual = actual;
  }

  compact(message: string): string {
    if (
      this.fExpected === null ||
      this.fActual === null ||
      this.areStringsEqual()
    ) {
      return Assert.format(message, this.fExpected, this.fActual);
    }

    this.findCommonPrefix();
    this.findCommonSuffix();
    const expected = this.compactString(this.fExpected);
    const actual = this.compactString(this.fActual);

    return Assert.format(message, expected, actual);
  }

  private compactString(source: string): string {
    let result =
      ComparisonCompactor.DELTA_START +
      source.substring(this.fPrefix, source.length - this.fSuffix + 1) +
      ComparisonCompactor.DELTA_END;

    if (this.fPrefix > 0) {
      result = this.computeCommonPrefix() + result;
    }
    if (this.fSuffix > 0) {
      result = result + this.computeCommonSuffix();
    }

    return result;
  }

  private findCommonPrefix(): void {
    const end = Math.min(this.fExpected.length, this.fActual.length);

    for (this.fPrefix = 0; this.fPrefix < end; this.fPrefix++) {
      if (
        this.fExpected.charAt(this.fPrefix) != this.fActual.charAt(this.fPrefix)
      ) {
        break;
      }
    }
  }

  private findCommonSuffix(): void {
    let expectedSuffix = this.fExpected.length - 1;
    let actualSuffix = this.fActual.length - 1;

    while (actualSuffix >= this.fPrefix && expectedSuffix >= this.fPrefix) {
      if (
        this.fExpected.charAt(expectedSuffix) !=
        this.fActual.charAt(actualSuffix)
      ) {
        break;
      }

      actualSuffix--;
      expectedSuffix--;
    }

    this.fSuffix = this.fExpected.length - expectedSuffix;
  }

  private computeCommonPrefix(): string {
    return (
      (this.fPrefix > this.fContextLength ? ComparisonCompactor.ELLIPSIS : "") +
      this.fExpected.substring(
        Math.max(0, this.fPrefix - this.fContextLength),
        this.fPrefix
      )
    );
  }

  private computeCommonSuffix(): string {
    const end = Math.min(
      this.fExpected.length - this.fSuffix + 1 + this.fContextLength,
      this.fExpected.length
    );
    return (
      this.fExpected.substring(this.fExpected.length - this.fSuffix + 1, end) +
      (this.fExpected.length - this.fSuffix + 1 <
      this.fExpected.length - this.fContextLength
        ? ComparisonCompactor.ELLIPSIS
        : "")
    );
  }

  private areStringsEqual(): boolean {
    return this.fExpected === this.fActual;
  }
}

export default ComparisonCompactor;
