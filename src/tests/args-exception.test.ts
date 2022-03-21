import ArgsException, { ErrorCode } from "../args-exception";

describe("ArgsException", () => {
  describe("constructor", () => {
    it("should make instance of ArgsException recognizable", () => {
      const exception = new ArgsException();

      const isInstance = exception instanceof ArgsException;
      expect(isInstance).toBe(true);
    });
  });

  describe(".errorCode", () => {
    it("should get set to a default when class is initialized", () => {
      const exception = new ArgsException();

      const errorCode = exception.errorCode;
      expect(errorCode).toBe(ErrorCode.OK);
    });

    it("should allow to be specified in the constructor", () => {
      const exception = new ArgsException(ErrorCode.UNEXPECTED_ARGUMENT);

      const errorCode = exception.errorCode;
      expect(errorCode).toBe(ErrorCode.UNEXPECTED_ARGUMENT);
    });

    it("should allow to be specified by a setter", () => {
      const exception = new ArgsException();
      exception.errorCode = ErrorCode.UNEXPECTED_ARGUMENT;

      const errorCode = exception.errorCode;
      expect(errorCode).toBe(ErrorCode.UNEXPECTED_ARGUMENT);
    });

    it("should allow the user to overwrite itself", () => {
      const exception = new ArgsException(ErrorCode.UNEXPECTED_ARGUMENT);
      exception.errorCode = ErrorCode.MISSING_ARGUMENT;

      const errorCode = exception.errorCode;
      expect(errorCode).toBe(ErrorCode.MISSING_ARGUMENT);
    });
  });

  describe(".errorParameter", () => {
    it("should get set to 'TILT' when class is initialized", () => {
      const exception = new ArgsException();

      const errorParameter = exception.errorParameter;
      expect(errorParameter).toBe("TILT");
    });

    it("should allow to be specified in the constructor", () => {
      const exception = new ArgsException(ErrorCode.OK, "-a");

      const errorParameter = exception.errorParameter;
      expect(errorParameter).toBe("-a");
    });

    it("should allow to be specified by a setter", () => {
      const exception = new ArgsException();
      exception.errorParameter = "-a";

      const errorParameter = exception.errorParameter;
      expect(errorParameter).toBe("-a");
    });

    it("should allow the user to overwrite itself", () => {
      const exception = new ArgsException(ErrorCode.OK, "-a");
      exception.errorParameter = "-b";

      const errorParameter = exception.errorParameter;
      expect(errorParameter).toBe("-b");
    });
  });

  describe(".errorArgumentId", () => {
    it("should get set to '\0' when class is initialized", () => {
      const exception = new ArgsException();

      const errorArgumentId = exception.errorArgumentId;
      expect(errorArgumentId).toBe("\0");
    });

    it("should allow to be specified in the constructor", () => {
      const exception = new ArgsException(ErrorCode.OK, "", "a");

      const errorArgumentId = exception.errorArgumentId;
      expect(errorArgumentId).toBe("a");
    });

    it("should allow to be specified by a setter", () => {
      const exception = new ArgsException();
      exception.errorArgumentId = "a";

      const errorArgumentId = exception.errorArgumentId;
      expect(errorArgumentId).toBe("a");
    });

    it("should allow the user to overwrite itself", () => {
      const exception = new ArgsException(ErrorCode.OK, "", "a");
      exception.errorArgumentId = "b";

      const errorArgumentId = exception.errorArgumentId;
      expect(errorArgumentId).toBe("b");
    });
  });
});
