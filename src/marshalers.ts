import ArgsException, { ErrorCode } from "./args-exception";

export interface ArgumentMarshaler {
  set(currentParameter: string): void;
  get(): Object;
}

export class BooleanArgumentMarshaler implements ArgumentMarshaler {
  private booleanValue: boolean = false;

  set(_currentParameter: string): void {
    this.booleanValue = true;
  }

  get(): Object {
    return this.booleanValue;
  }
}

export class StringArgumentMarshaler implements ArgumentMarshaler {
  private stringValue: string = "";

  set(currentParameter: string): void {
    if (currentParameter === undefined) {
      throw new ArgsException({ code: ErrorCode.MISSING_ARGUMENT });
    }

    this.stringValue = currentParameter;
  }

  get(): Object {
    return this.stringValue;
  }
}

export class NumberArgumentMarshaler implements ArgumentMarshaler {
  private numberValue: number = 0;

  set(currentParameter: string): void {
    if (currentParameter === undefined) {
      throw new ArgsException({ code: ErrorCode.MISSING_ARGUMENT });
    }
    if (isNaN(Number(currentParameter))) {
      throw new ArgsException({
        code: ErrorCode.INVALID_NUMBER,
        parameter: currentParameter,
      });
    }

    this.numberValue = Number(currentParameter);
  }

  get(): Object {
    return this.numberValue;
  }
}
