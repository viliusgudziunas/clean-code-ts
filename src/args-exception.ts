export enum ErrorCode {
  INVALID_NUMBER,
  MISSING_ARGUMENT,
  OK,
  UNEXPECTED_ARGUMENT,
}

export interface ArgsExceptionParams {
  argumentId?: string;
  code?: ErrorCode;
  message?: string;
  parameter?: string;
}

const argsExceptionDefaultParams: ArgsExceptionParams = {
  argumentId: "\0",
  code: ErrorCode.OK,
  message: "",
  parameter: "TILT",
};

class ArgsException extends Error {
  private codeValue: ArgsExceptionParams["code"];
  private parameterValue: ArgsExceptionParams["parameter"];
  private argumentIdValue: ArgsExceptionParams["argumentId"];

  constructor(params?: ArgsExceptionParams) {
    params = { ...argsExceptionDefaultParams, ...params };
    super(params.message);
    // A way to make instanceof work for Error children
    Object.setPrototypeOf(this, ArgsException.prototype);

    this.code = params.code;
    this.parameter = params.parameter;
    this.argumentId = params.argumentId;
  }

  get code(): ArgsExceptionParams["code"] {
    return this.codeValue;
  }
  set code(code: ArgsExceptionParams["code"]) {
    this.codeValue = code;
  }

  get parameter(): ArgsExceptionParams["parameter"] {
    return this.parameterValue;
  }
  set parameter(parameter: ArgsExceptionParams["parameter"]) {
    this.parameterValue = parameter;
  }

  get argumentId(): ArgsExceptionParams["argumentId"] {
    return this.argumentIdValue;
  }
  set argumentId(argumentId: ArgsExceptionParams["argumentId"]) {
    this.argumentIdValue = argumentId;
  }

  get errorMessage(): string {
    switch (this.code) {
      case ErrorCode.OK:
        throw new Error("TILT: Should not get here.");
      case ErrorCode.UNEXPECTED_ARGUMENT:
        return `Argument '-${this.argumentId}' unexpected.`;
      case ErrorCode.MISSING_ARGUMENT:
        return `Could not find parameter for '-${this.argumentId}'.`;
      case ErrorCode.INVALID_NUMBER:
        return `Found invalid number parameter '${this.parameter}' for '-${this.argumentId}'.`;
      default:
        return "";
    }
  }
}

export default ArgsException;
