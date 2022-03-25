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

  private contextLength: number;
  private expected: string;
  private actual: string;
  private prefix: number;
  private suffix: number;

  constructor(contextLength: number, expected: string, actual: string) {
    this.contextLength = contextLength;
    this.expected = expected;
    this.actual = actual;
  }

  compact(message: string): string {
    if (this.shouldNotCompact()) {
      return Assert.format(message, this.expected, this.actual);
    }

    this.findCommonPrefix();
    this.findCommonSuffix();
    const expected = this.compactString(this.expected);
    const actual = this.compactString(this.actual);

    return Assert.format(message, expected, actual);
  }

  private shouldNotCompact(): boolean {
    return (
      this.expected === null || this.actual === null || this.areStringsEqual()
    );
  }

  private compactString(source: string): string {
    let result =
      ComparisonCompactor.DELTA_START +
      source.substring(this.prefix, source.length - this.suffix + 1) +
      ComparisonCompactor.DELTA_END;

    if (this.prefix > 0) {
      result = this.computeCommonPrefix() + result;
    }
    if (this.suffix > 0) {
      result = result + this.computeCommonSuffix();
    }

    return result;
  }

  private findCommonPrefix(): void {
    const end = Math.min(this.expected.length, this.actual.length);

    for (this.prefix = 0; this.prefix < end; this.prefix++) {
      if (
        this.expected.charAt(this.prefix) != this.actual.charAt(this.prefix)
      ) {
        break;
      }
    }
  }

  private findCommonSuffix(): void {
    let expectedSuffix = this.expected.length - 1;
    let actualSuffix = this.actual.length - 1;

    while (actualSuffix >= this.prefix && expectedSuffix >= this.prefix) {
      if (
        this.expected.charAt(expectedSuffix) != this.actual.charAt(actualSuffix)
      ) {
        break;
      }

      actualSuffix--;
      expectedSuffix--;
    }

    this.suffix = this.expected.length - expectedSuffix;
  }

  private computeCommonPrefix(): string {
    return (
      (this.prefix > this.contextLength ? ComparisonCompactor.ELLIPSIS : "") +
      this.expected.substring(
        Math.max(0, this.prefix - this.contextLength),
        this.prefix
      )
    );
  }

  private computeCommonSuffix(): string {
    const end = Math.min(
      this.expected.length - this.suffix + 1 + this.contextLength,
      this.expected.length
    );
    return (
      this.expected.substring(this.expected.length - this.suffix + 1, end) +
      (this.expected.length - this.suffix + 1 <
      this.expected.length - this.contextLength
        ? ComparisonCompactor.ELLIPSIS
        : "")
    );
  }

  private areStringsEqual(): boolean {
    return this.expected === this.actual;
  }
}

export default ComparisonCompactor;
