export enum ErrorCode {
  INVALID_NUMBER,
  MISSING_ARGUMENT,
  OK,
  UNEXPECTED_ARGUMENT,
}

class ArgsException extends Error {
  private errorCodeValue: ErrorCode;
  private errorParameterValue: string;
  private errorArgumentIdValue: string = "\0";

  constructor(
    errorCode: ErrorCode = ErrorCode.OK,
    errorParameter: string = "TILT",
    errorArgumentId: string = "\0"
  ) {
    super();
    // A way to make instanceof work for Error children
    Object.setPrototypeOf(this, ArgsException.prototype);
    this.errorCode = errorCode;
    this.errorParameter = errorParameter;
    this.errorArgumentId = errorArgumentId;
  }

  get errorCode(): ErrorCode {
    return this.errorCodeValue;
  }
  set errorCode(errorCode: ErrorCode) {
    this.errorCodeValue = errorCode;
  }

  get errorParameter(): string | undefined {
    return this.errorParameterValue;
  }
  set errorParameter(errorParameter: string) {
    this.errorParameterValue = errorParameter;
  }

  get errorArgumentId(): string {
    return this.errorArgumentIdValue;
  }
  set errorArgumentId(errorArgumentId: string) {
    this.errorArgumentIdValue = errorArgumentId;
  }
}

export default ArgsException;
