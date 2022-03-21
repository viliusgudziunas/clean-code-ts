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

  constructor(params: ArgsExceptionParams = argsExceptionDefaultParams) {
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
}

export default ArgsException;
