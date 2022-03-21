class Args {
  private schema: string;
  private args: string[];
  private valid: boolean = true;
  private unexpectedArguments: Set<string> = new Set<string>();
  private marshalers: { [K: string]: ArgumentMarshaler } = {};
  private argsFound: Set<string> = new Set<string>();
  private currentParameter: string = "";
  private errorArgumentId: string = "\0";
  private errorParameter: string = "TILT";
  private errorCode: ErrorCode = ErrorCode.OK;

  constructor(schema: string, args: string[]) {
    this.schema = schema;
    this.args = args;
    this.valid = this.parse();
  }

  private parse(): boolean {
    if (this.schema.length === 0 && this.args.length === 0) {
      return true;
    }

    this.parseSchema();
    try {
      this.parseArguments();
    } catch (error) {}

    return this.valid;
  }

  private parseSchema(): boolean {
    this.schema
      .split(",")
      .filter((element) => element.length > 0)
      .forEach((element) => this.parseSchemaElement(element.trim()));

    return true;
  }

  private parseSchemaElement(element: string): void {
    const elementId = element.charAt(0);
    const elementTail = element.substring(1);
    this.validateSchemaElementId(elementId);

    if (this.isBooleanSchemaElement(elementTail)) {
      this.parseBooleanSchemaElement(elementId);
    } else if (this.isStringSchemaElement(elementTail)) {
      this.parseStringSchemaElement(elementId);
    } else if (this.isNumberSchemaElement(elementTail)) {
      this.parseNumberSchemaElement(elementId);
    } else {
      throw new Error(
        `Argument: ${elementId} has invalid format: ${elementTail}`
      );
    }
  }

  private validateSchemaElementId(elementId: string): void {
    if (!elementId.match(/[a-z]/i)) {
      throw new Error(
        `Bad character: ${elementId} in Args format: ${this.schema}`
      );
    }
  }

  private isBooleanSchemaElement(elementTail: string): boolean {
    return elementTail.length === 0;
  }

  private isStringSchemaElement(elementTail: string): boolean {
    return elementTail === "*";
  }

  private isNumberSchemaElement(elementTail: string): boolean {
    return elementTail === "#";
  }

  private parseBooleanSchemaElement(elementId: string): void {
    this.marshalers[elementId] = new BooleanArgumentMarshaler();
  }

  private parseStringSchemaElement(elementId: string): void {
    this.marshalers[elementId] = new StringArgumentMarshaler();
  }

  private parseNumberSchemaElement(elementId: string): void {
    this.marshalers[elementId] = new NumberArgumentMarshaler();
  }

  private parseArguments(): boolean {
    this.args.forEach((arg, index) => {
      this.currentParameter = this.args[index + 1];
      this.parseArgument(arg);
    });

    return true;
  }

  private parseArgument(arg: string): void {
    if (arg.startsWith("-")) {
      this.parseElements(arg);
    }
  }

  private parseElements(arg: string): void {
    arg
      .substring(1)
      .split("")
      .forEach((element) => this.parseElement(element));
  }

  private parseElement(argChar: string): void {
    if (this.setArgument(argChar)) {
      this.argsFound.add(argChar);
    } else {
      this.unexpectedArguments.add(argChar);
      this.errorCode = ErrorCode.UNEXPECTED_ARGUMENT;
      this.valid = false;
    }
  }

  private setArgument(argChar: string): boolean {
    const marshaler = this.marshalers[argChar];
    if (marshaler === undefined) {
      return false;
    }

    try {
      marshaler.set(this.currentParameter);
    } catch (error) {
      this.valid = false;
      this.errorArgumentId = argChar;
      this.errorCode = error.errorCode;
      this.errorParameter = error.errorParameter;
      throw error;
    }

    return true;
  }

  private isBooleanArg(marshaler: ArgumentMarshaler): boolean {
    return marshaler instanceof BooleanArgumentMarshaler;
  }

  private isStringArg(marshaler: ArgumentMarshaler): boolean {
    return marshaler instanceof StringArgumentMarshaler;
  }

  private isNumberArg(marshaler: ArgumentMarshaler): boolean {
    return marshaler instanceof NumberArgumentMarshaler;
  }

  get cardinality(): number {
    return this.argsFound.size;
  }

  get usage(): string {
    if (this.schema.length > 0) {
      return `[${this.schema}]`;
    } else {
      return "";
    }
  }

  get errorMessage(): string {
    switch (this.errorCode) {
      case ErrorCode.OK:
        throw new Error("TILT: Should not get here.");
      case ErrorCode.UNEXPECTED_ARGUMENT:
        return this.unexpectedArgumentMessage();
      case ErrorCode.MISSING_ARGUMENT:
        return `Could not find parameter for -${this.errorArgumentId}.`;
      case ErrorCode.INVALID_NUMBER:
        return `Found invalid number parameter ${this.errorParameter} for -${this.errorArgumentId}.`;
      default:
        return "";
    }
  }

  private unexpectedArgumentMessage(): string {
    let message = "Argument(s) ";
    this.unexpectedArguments.forEach((arg) => (message += `-${arg} `));
    message += "unexpected.";
    return message;
  }

  getBoolean(arg: string): boolean {
    const marshaler = this.marshalers[arg];
    if (marshaler !== undefined && this.isBooleanArg(marshaler)) {
      return marshaler.get() as boolean;
    } else {
      return false;
    }
  }

  getString(arg: string): string {
    const marshaler = this.marshalers[arg];
    if (marshaler !== undefined && this.isStringArg(marshaler)) {
      return marshaler.get() as string;
    } else {
      return "";
    }
  }

  getNumber(arg: string): number {
    const marshaler = this.marshalers[arg];
    if (marshaler !== undefined && this.isNumberArg(marshaler)) {
      return marshaler.get() as number;
    } else {
      return 0;
    }
  }

  has(arg: string): boolean {
    return this.argsFound.has(arg);
  }

  get isValid(): boolean {
    return this.valid;
  }
}

enum ErrorCode {
  INVALID_NUMBER,
  MISSING_ARGUMENT,
  OK,
  UNEXPECTED_ARGUMENT,
}

interface ArgumentMarshaler {
  set(currentParameter: string): void;
  get(): Object;
}

class BooleanArgumentMarshaler implements ArgumentMarshaler {
  private booleanValue: boolean = false;

  set(_currentParameter: string): void {
    this.booleanValue = true;
  }

  get(): Object {
    return this.booleanValue;
  }
}

class StringArgumentMarshaler implements ArgumentMarshaler {
  private stringValue: string = "";

  set(currentParameter: string): void {
    if (currentParameter === undefined) {
      throw new ArgsException(ErrorCode.MISSING_ARGUMENT);
    }

    this.stringValue = currentParameter;
  }

  get(): Object {
    return this.stringValue;
  }
}

class NumberArgumentMarshaler implements ArgumentMarshaler {
  private numberValue: number = 0;

  set(currentParameter: string): void {
    if (currentParameter === undefined) {
      throw new ArgsException(ErrorCode.MISSING_ARGUMENT);
    }
    if (isNaN(Number(currentParameter))) {
      throw new ArgsException(ErrorCode.INVALID_NUMBER, currentParameter);
    }

    this.numberValue = Number(currentParameter);
  }

  get(): Object {
    return this.numberValue;
  }
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

export default Args;