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

  describe(".errorMessage", () => {
    it("should throw TILT error when error code is OK", () => {
      const exception = new ArgsException();

      expect(() => exception.errorMessage).toThrowError(Error);
      expect(() => exception.errorMessage).toThrowError(
        "TILT: Should not get here."
      );
    });

    it("should return default argumentId when code is UNEXPECTED_ARGUMENT, but no argument was passed in", () => {
      const exception = new ArgsException({
        code: ErrorCode.UNEXPECTED_ARGUMENT,
      });

      const errorMessage = exception.errorMessage;
      expect(errorMessage).toBe("Argument '-\0' unexpected.");
    });

    it("should return argumentId when code is UNEXPECTED_ARGUMENT and argumentId was passed in via constructor", () => {
      const exception = new ArgsException({
        code: ErrorCode.UNEXPECTED_ARGUMENT,
        argumentId: "a",
      });

      const errorMessage = exception.errorMessage;
      expect(errorMessage).toBe("Argument '-a' unexpected.");
    });

    it("should return argumentId when code is UNEXPECTED_ARGUMENT and argumentId was passed in via setter", () => {
      const exception = new ArgsException({
        code: ErrorCode.UNEXPECTED_ARGUMENT,
      });
      exception.argumentId = "b";

      const errorMessage = exception.errorMessage;
      expect(errorMessage).toBe("Argument '-b' unexpected.");
    });

    it("should return default argumentId when code is MISSING_ARGUMENT, but no argument was passed in", () => {
      const exception = new ArgsException({ code: ErrorCode.MISSING_ARGUMENT });

      const errorMessage = exception.errorMessage;
      expect(errorMessage).toBe("Could not find parameter for '-\0'.");
    });

    it("should return argumentId when code is MISSING_ARGUMENT and argumentId was passed in via constructor", () => {
      const exception = new ArgsException({
        code: ErrorCode.MISSING_ARGUMENT,
        argumentId: "a",
      });

      const errorMessage = exception.errorMessage;
      expect(errorMessage).toBe("Could not find parameter for '-a'.");
    });

    it("should return argumentId when code is MISSING_ARGUMENT and argumentId was passed in via setter", () => {
      const exception = new ArgsException({ code: ErrorCode.MISSING_ARGUMENT });
      exception.argumentId = "b";

      const errorMessage = exception.errorMessage;
      expect(errorMessage).toBe("Could not find parameter for '-b'.");
    });

    it("should return default argumentId and parameter when code is INVALID_NUMBER, but no argument and no parameter were passed in", () => {
      const exception = new ArgsException({ code: ErrorCode.INVALID_NUMBER });

      const errorMessage = exception.errorMessage;
      expect(errorMessage).toBe(
        "Found invalid number parameter 'TILT' for '-\0'."
      );
    });

    it("should return argumentId and parameter when code is INVALID_NUMBER and argumentId and parameter were passed in via constructor", () => {
      const exception = new ArgsException({
        code: ErrorCode.INVALID_NUMBER,
        argumentId: "a",
        parameter: "hey",
      });

      const errorMessage = exception.errorMessage;
      expect(errorMessage).toBe(
        "Found invalid number parameter 'hey' for '-a'."
      );
    });

    it("should return argumentId and parameter when code is INVALID_NUMBER and argumentId and parameter were passed in via setters", () => {
      const exception = new ArgsException({ code: ErrorCode.INVALID_NUMBER });
      exception.argumentId = "b";
      exception.parameter = "test";

      const errorMessage = exception.errorMessage;
      expect(errorMessage).toBe(
        "Found invalid number parameter 'test' for '-b'."
      );
    });
  });
});
