import ArgsException, { ErrorCode } from "../args-exception";

describe("ArgsException", () => {
  describe("constructor", () => {
    it("should make instance of ArgsException recognizable", () => {
      const exception = new ArgsException();

      const isInstance = exception instanceof ArgsException;
      expect(isInstance).toBe(true);
    });

    it("should allow to specify error message", () => {
      const exception = new ArgsException({ message: "Error message" });

      const message = exception.message;
      expect(message).toBe("Error message");
    });
  });

  describe(".errorCode", () => {
    it("should get set to a default when class is initialized", () => {
      const exception = new ArgsException();

      const errorCode = exception.code;
      expect(errorCode).toBe(ErrorCode.OK);
    });

    it("should allow to be specified in the constructor", () => {
      const exception = new ArgsException({
        code: ErrorCode.UNEXPECTED_ARGUMENT,
      });

      const errorCode = exception.code;
      expect(errorCode).toBe(ErrorCode.UNEXPECTED_ARGUMENT);
    });

    it("should allow to be specified by a setter", () => {
      const exception = new ArgsException();
      exception.code = ErrorCode.UNEXPECTED_ARGUMENT;

      const errorCode = exception.code;
      expect(errorCode).toBe(ErrorCode.UNEXPECTED_ARGUMENT);
    });

    it("should allow the user to overwrite itself", () => {
      const exception = new ArgsException({
        code: ErrorCode.UNEXPECTED_ARGUMENT,
      });
      exception.code = ErrorCode.MISSING_ARGUMENT;

      const errorCode = exception.code;
      expect(errorCode).toBe(ErrorCode.MISSING_ARGUMENT);
    });
  });

  describe(".errorParameter", () => {
    it("should get set to 'TILT' when class is initialized", () => {
      const exception = new ArgsException();

      const errorParameter = exception.parameter;
      expect(errorParameter).toBe("TILT");
    });

    it("should allow to be specified in the constructor", () => {
      const exception = new ArgsException({ parameter: "-a" });

      const errorParameter = exception.parameter;
      expect(errorParameter).toBe("-a");
    });

    it("should allow to be specified by a setter", () => {
      const exception = new ArgsException();
      exception.parameter = "-a";

      const errorParameter = exception.parameter;
      expect(errorParameter).toBe("-a");
    });

    it("should allow the user to overwrite itself", () => {
      const exception = new ArgsException({ parameter: "-a" });
      exception.parameter = "-b";

      const errorParameter = exception.parameter;
      expect(errorParameter).toBe("-b");
    });
  });

  describe(".errorArgumentId", () => {
    it("should get set to '\0' when class is initialized", () => {
      const exception = new ArgsException();

      const errorArgumentId = exception.argumentId;
      expect(errorArgumentId).toBe("\0");
    });

    it("should allow to be specified in the constructor", () => {
      const exception = new ArgsException({ argumentId: "a" });

      const errorArgumentId = exception.argumentId;
      expect(errorArgumentId).toBe("a");
    });

    it("should allow to be specified by a setter", () => {
      const exception = new ArgsException();
      exception.argumentId = "a";

      const errorArgumentId = exception.argumentId;
      expect(errorArgumentId).toBe("a");
    });

    it("should allow the user to overwrite itself", () => {
      const exception = new ArgsException({ argumentId: "a" });
      exception.argumentId = "b";

      const errorArgumentId = exception.argumentId;
      expect(errorArgumentId).toBe("b");
    });
  });
});
