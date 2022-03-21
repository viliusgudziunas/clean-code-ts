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

    it("should allow to be specified by the user", () => {
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
    it("should get set to undefined when class is initialized", () => {
      const exception = new ArgsException();

      const errorParameter = exception.errorParameter;
      expect(errorParameter).toBe(undefined);
    });

    it("should allow to be specified in the constructor", () => {
      const exception = new ArgsException(ErrorCode.OK, "-a");

      const errorParameter = exception.errorParameter;
      expect(errorParameter).toBe("-a");
    });

    it("should allow to be specified by the user", () => {
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
});
