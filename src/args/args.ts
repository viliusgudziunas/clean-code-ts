import ArgsException, { ErrorCode } from "./args-exception";
import {
  ArgumentMarshaler,
  BooleanArgumentMarshaler,
  NumberArgumentMarshaler,
  StringArgumentMarshaler,
} from "./marshalers";

class Args {
  private schema: string;
  private args: string[];
  private marshalers: { [K: string]: ArgumentMarshaler } = {};
  private argsFound: Set<string> = new Set<string>();
  private currentParameter: string = "";

  constructor(schema: string, args: string[]) {
    this.schema = schema;
    this.args = args;
    this.parse();
  }

  private parse(): void {
    this.parseSchema();
    this.parseArguments();
  }

  private parseSchema(): void {
    this.validateSchema();

    this.schema
      .split(",")
      .filter((element) => element.length > 0)
      .forEach((element) => this.parseSchemaElement(element.trim()));
  }

  private validateSchema(): void {
    if (this.schema === "") {
      throw new ArgsException({
        code: ErrorCode.INVALID_SCHEMA,
        argumentId: this.schema,
      });
    }
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
      throw new ArgsException({
        code: ErrorCode.INVALID_FORMAT,
        argumentId: elementId,
        parameter: elementTail,
      });
    }
  }

  private validateSchemaElementId(elementId: string): void {
    if (!elementId.match(/[a-z]/i)) {
      throw new ArgsException({
        code: ErrorCode.INVALID_ARGUMENT_NAME,
        argumentId: elementId,
      });
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

  private parseArguments(): void {
    this.args.forEach((arg, index) => {
      this.currentParameter = this.args[index + 1];
      this.parseArgument(arg);
    });
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
      throw new ArgsException({
        code: ErrorCode.UNEXPECTED_ARGUMENT,
        argumentId: argChar,
      });
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
      if (error instanceof ArgsException) {
        error.argumentId = argChar;
      }
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
}

export default Args;
