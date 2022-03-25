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
  private prefixLength: number;
  private suffixLength: number;

  constructor(contextLength: number, expected: string, actual: string) {
    this.contextLength = contextLength;
    this.expected = expected;
    this.actual = actual;
  }

  formatCompactedComparison(message: string): string {
    let compactExpected = this.expected;
    let compactActual = this.actual;
    if (this.shouldBeCompacted()) {
      this.findCommonPrefixAndSuffix();
      compactExpected = this.compact(this.expected);
      compactActual = this.compact(this.actual);
    }
    return Assert.format(message, compactExpected, compactActual);
  }

  private shouldBeCompacted(): boolean {
    return !this.shouldNotBeCompacted();
  }

  private shouldNotBeCompacted(): boolean {
    return (
      this.expected === null || this.actual === null || this.areStringsEqual()
    );
  }

  private findCommonPrefixAndSuffix(): void {
    this.findCommonPrefix();

    for (
      this.suffixLength = 0;
      !this.suffixOverlapsPrefix(this.suffixLength);
      this.suffixLength++
    ) {
      if (
        this.charFromEnd(this.expected, this.suffixLength) !=
        this.charFromEnd(this.actual, this.suffixLength)
      ) {
        break;
      }
    }
  }

  private suffixOverlapsPrefix(suffixLength: number): boolean {
    return (
      this.actual.length - suffixLength <= this.prefixLength ||
      this.expected.length - suffixLength <= this.prefixLength
    );
  }

  private charFromEnd(text: string, index: number): string {
    return text.charAt(text.length - index - 1);
  }

  private findCommonPrefix(): void {
    const end = Math.min(this.expected.length, this.actual.length);

    for (this.prefixLength = 0; this.prefixLength < end; this.prefixLength++) {
      if (
        this.expected.charAt(this.prefixLength) !=
        this.actual.charAt(this.prefixLength)
      ) {
        break;
      }
    }
  }

  private compact(source: string): string {
    return (
      this.startingEllipsis() +
      this.startingContext() +
      ComparisonCompactor.DELTA_START +
      source.substring(this.prefixLength, source.length - this.suffixLength) +
      ComparisonCompactor.DELTA_END +
      this.computeCommonSuffix()
    );
  }

  private startingEllipsis(): string {
    return this.prefixLength > this.contextLength
      ? ComparisonCompactor.ELLIPSIS
      : "";
  }

  private startingContext(): string {
    const contextStart = Math.max(0, this.prefixLength - this.contextLength);
    const contextEnd = this.prefixLength;
    return this.expected.substring(contextStart, contextEnd);
  }

  private computeCommonSuffix(): string {
    const end = Math.min(
      this.expected.length - this.suffixLength + this.contextLength,
      this.expected.length
    );
    return (
      this.expected.substring(this.expected.length - this.suffixLength, end) +
      (this.expected.length - this.suffixLength <
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
