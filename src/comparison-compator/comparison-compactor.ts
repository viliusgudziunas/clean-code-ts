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
  private suffixLength: number;

  constructor(contextLength: number, expected: string, actual: string) {
    this.contextLength = contextLength;
    this.expected = expected;
    this.actual = actual;
  }

  formatCompactedComparison(message: string): string {
    let compactExpected = this.expected;
    let compactActual = this.actual;
    if (this.canBeCompacted()) {
      this.findCommonPrefixAndSuffix();
      compactExpected = this.compactString(this.expected);
      compactActual = this.compactString(this.actual);
    }
    return Assert.format(message, compactExpected, compactActual);
  }

  private canBeCompacted(): boolean {
    return (
      this.expected !== null && this.actual !== null && !this.areStringsEqual()
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
      this.actual.length - suffixLength <= this.prefixIndex ||
      this.expected.length - suffixLength <= this.prefixIndex
    );
  }

  private charFromEnd(text: string, index: number): string {
    return text.charAt(text.length - index - 1);
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
    return (
      this.computeCommonPrefix() +
      ComparisonCompactor.DELTA_START +
      source.substring(this.prefixIndex, source.length - this.suffixLength) +
      ComparisonCompactor.DELTA_END +
      this.computeCommonSuffix()
    );
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
