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
  private prefixIndex: number;
  private suffixIndex: number;
  private compactExpected: string;
  private compactActual: string;

  constructor(contextLength: number, expected: string, actual: string) {
    this.contextLength = contextLength;
    this.expected = expected;
    this.actual = actual;
  }

  formatCompactedComparison(message: string): string {
    if (this.canBeCompacted()) {
      this.compactExpectedAndActual();
      return Assert.format(message, this.compactExpected, this.compactActual);
    }
    return Assert.format(message, this.expected, this.actual);
  }

  private canBeCompacted(): boolean {
    return (
      this.expected !== null && this.actual !== null && !this.areStringsEqual()
    );
  }

  private compactExpectedAndActual(): void {
    this.findCommonPrefixAndSuffix();
    this.compactExpected = this.compactString(this.expected);
    this.compactActual = this.compactString(this.actual);
  }

  private findCommonPrefixAndSuffix(): void {
    this.findCommonPrefix();
    let expectedSuffix = this.expected.length - 1;
    let actualSuffix = this.actual.length - 1;

    while (
      actualSuffix >= this.prefixIndex &&
      expectedSuffix >= this.prefixIndex
    ) {
      if (
        this.expected.charAt(expectedSuffix) != this.actual.charAt(actualSuffix)
      ) {
        break;
      }

      actualSuffix--;
      expectedSuffix--;
    }

    this.suffixIndex = this.expected.length - expectedSuffix;
  }

  private findCommonPrefix(): void {
    const end = Math.min(this.expected.length, this.actual.length);

    for (this.prefixIndex = 0; this.prefixIndex < end; this.prefixIndex++) {
      if (
        this.expected.charAt(this.prefixIndex) !=
        this.actual.charAt(this.prefixIndex)
      ) {
        break;
      }
    }
  }

  private compactString(source: string): string {
    let result =
      ComparisonCompactor.DELTA_START +
      source.substring(this.prefixIndex, source.length - this.suffixIndex + 1) +
      ComparisonCompactor.DELTA_END;

    if (this.prefixIndex > 0) {
      result = this.computeCommonPrefix() + result;
    }
    if (this.suffixIndex > 0) {
      result = result + this.computeCommonSuffix();
    }

    return result;
  }

  private computeCommonPrefix(): string {
    return (
      (this.prefixIndex > this.contextLength
        ? ComparisonCompactor.ELLIPSIS
        : "") +
      this.expected.substring(
        Math.max(0, this.prefixIndex - this.contextLength),
        this.prefixIndex
      )
    );
  }

  private computeCommonSuffix(): string {
    const end = Math.min(
      this.expected.length - this.suffixIndex + 1 + this.contextLength,
      this.expected.length
    );
    return (
      this.expected.substring(
        this.expected.length - this.suffixIndex + 1,
        end
      ) +
      (this.expected.length - this.suffixIndex + 1 <
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
