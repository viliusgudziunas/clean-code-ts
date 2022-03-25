import ComparisonCompactor from "src/comparison-compator/comparison-compactor";

// Tests copied from the book
describe("ComparisonCompator", () => {
  it("test message", () => {
    const failure = new ComparisonCompactor(0, "b", "c").compact("a");
    expect(failure).toBe("a expected:<[b]> but was:<[c]>");
  });

  it("test start same", () => {
    const failure = new ComparisonCompactor(1, "ba", "bc").compact(null);
    expect(failure).toBe("expected:<b[a]> but was:<b[c]>");
  });

  it("test end same", () => {
    const failure = new ComparisonCompactor(1, "ab", "cb").compact(null);
    expect(failure).toBe("expected:<[a]b> but was:<[c]b>");
  });

  it("test same", () => {
    const failure = new ComparisonCompactor(1, "ab", "ab").compact(null);
    expect(failure).toBe("expected:<ab> but was:<ab>");
  });

  it("test no context start and end same", () => {
    const failure = new ComparisonCompactor(0, "abc", "adc").compact(null);
    expect(failure).toBe("expected:<...[b]...> but was:<...[d]...>");
  });

  it("test start and end context", () => {
    const failure = new ComparisonCompactor(1, "abc", "adc").compact(null);
    expect(failure).toBe("expected:<a[b]c> but was:<a[d]c>");
  });

  it("test start and end context with ellipses", () => {
    const failure = new ComparisonCompactor(1, "abcde", "abfde").compact(null);
    expect(failure).toBe("expected:<...b[c]d...> but was:<...b[f]d...>");
  });

  it("test comparison error start same complete", () => {
    const failure = new ComparisonCompactor(2, "ab", "abc").compact(null);
    expect(failure).toBe("expected:<ab[]> but was:<ab[c]>");
  });

  it("test comparison error end same complete", () => {
    const failure = new ComparisonCompactor(0, "bc", "abc").compact(null);
    expect(failure).toBe("expected:<[]...> but was:<[a]...>");
  });

  it("test comparison error end same complete context", () => {
    const failure = new ComparisonCompactor(2, "bc", "abc").compact(null);
    expect(failure).toBe("expected:<[]bc> but was:<[a]bc>");
  });

  it("test comparison error overlapping matches", () => {
    const failure = new ComparisonCompactor(0, "abc", "abbc").compact(null);
    expect(failure).toBe("expected:<...[]...> but was:<...[b]...>");
  });

  it("test comparison error overlapping matches context", () => {
    const failure = new ComparisonCompactor(2, "abc", "abbc").compact(null);
    expect(failure).toBe("expected:<ab[]c> but was:<ab[b]c>");
  });

  it("test comparison error overlapping matches 2", () => {
    const failure = new ComparisonCompactor(0, "abcdde", "abcde").compact(null);
    expect(failure).toBe("expected:<...[d]...> but was:<...[]...>");
  });

  it("test comparison error overlapping matches 2 context", () => {
    const failure = new ComparisonCompactor(2, "abcdde", "abcde").compact(null);
    expect(failure).toBe("expected:<...cd[d]e> but was:<...cd[]e>");
  });

  it("test comparison error with actual null", () => {
    const failure = new ComparisonCompactor(0, "a", null).compact(null);
    expect(failure).toBe("expected:<a> but was:<null>");
  });

  it("test comparison error with actual null context", () => {
    const failure = new ComparisonCompactor(2, "a", null).compact(null);
    expect(failure).toBe("expected:<a> but was:<null>");
  });

  it("test comparison error with expected null", () => {
    const failure = new ComparisonCompactor(0, null, "a").compact(null);
    expect(failure).toBe("expected:<null> but was:<a>");
  });

  it("test comparison error with expected null", () => {
    const failure = new ComparisonCompactor(2, null, "a").compact(null);
    expect(failure).toBe("expected:<null> but was:<a>");
  });

  it("test bug 609972", () => {
    const failure = new ComparisonCompactor(10, "S&P500", "0").compact(null);
    expect(failure).toBe("expected:<[S&P50]0> but was:<[]0>");
  });
});
