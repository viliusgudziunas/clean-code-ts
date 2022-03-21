export enum ErrorCode {
  INVALID_NUMBER,
  MISSING_ARGUMENT,
  OK,
  UNEXPECTED_ARGUMENT,
}

class ArgsException extends Error {
  private errorCodeValue: ErrorCode;
  private errorParameterValue: string;

  constructor(
    errorCode: ErrorCode = ErrorCode.OK,
    errorParameter: string = undefined
  ) {
    super();
    // A way to make instanceof work for Error children
    Object.setPrototypeOf(this, ArgsException.prototype);
    this.errorCode = errorCode;
    this.errorParameter = errorParameter;
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
}

export default ArgsException;
