import Args from "../args/args";
import { ErrorCode } from "../args/args-exception";
import { parseInput } from "./test-utils";

describe("Args", () => {
  describe(".getBoolean()", () => {
    it("should return true when argument is in schema and input arguments", () => {
      const input = "-l";
      const arg: Args = new Args("l", parseInput(input));

      const boolean = arg.getBoolean("l");
      expect(boolean).toBe(true);
    });

    it("should return false when argument is not in input arguments", () => {
      const input = "";
      const arg: Args = new Args("l", parseInput(input));

      const boolean = arg.getBoolean("l");
      expect(boolean).toBe(false);
    });

    it("should return false when calling with a non-boolean argument", () => {
      const input = "-k -p 5000";
      const arg: Args = new Args("k,p#", parseInput(input));

      const boolean = arg.getBoolean("p");
      expect(boolean).toBe(false);
    });
  });

  describe(".getString()", () => {
    it("should return string which was passed in after string argument when argument is in schema", () => {
      const input = "-f hello.txt";
      const arg: Args = new Args("f*", parseInput(input));

      const string = arg.getString("f");
      expect(string).toBe("hello.txt");
    });

    it("should return empty string when calling with a non-string argument", () => {
      const input = "-k -d ./";
      const arg: Args = new Args("k,d*", parseInput(input));

      const string = arg.getString("k");
      expect(string).toBe("");
    });
  });

  describe(".getNumber()", () => {
    it.each<[number, number]>([
      [5000, 5000],
      [19.99, 19.99],
    ])(
      "should return %s when %s was passed in as argument and when argument is in schema",
      (numberInput) => {
        const input = `-p ${numberInput}`;
        const arg: Args = new Args("p#", parseInput(input));

        const number = arg.getNumber("p");
        expect(number).toBe(numberInput);
      }
    );

    it("should return 0 when calling with a non-number argument", () => {
      const input = "-k -p 5000";
      const arg: Args = new Args("k,p#", parseInput(input));

      const number = arg.getNumber("k");
      expect(number).toBe(0);
    });
  });

  describe(".has()", () => {
    it("should return true when argument was found in schema and arguments", () => {
      const input = "-l";
      const arg: Args = new Args("l", parseInput(input));

      const hasArgument = arg.has("l");
      expect(hasArgument).toBe(true);
    });

    it("should return true for all arguments that were found in schema and arguments", () => {
      const input = "-l -t hello";
      const arg: Args = new Args("l,t*", parseInput(input));

      const hasL = arg.has("l");
      expect(hasL).toBe(true);
      const hasT = arg.has("t");
      expect(hasT).toBe(true);
    });

    it("should return false when argument was not found in schema", () => {
      const input = "-f";
      const arg: Args = new Args("f", parseInput(input));

      const hasArgument = arg.has("l");
      expect(hasArgument).toBe(false);
    });

    it("should return false when argument was not found in arguments", () => {
      const input = "-f";
      const arg: Args = new Args("f,l", parseInput(input));

      const hasArgument = arg.has("l");
      expect(hasArgument).toBe(false);
    });

    it("should return false when argument was not found in schema and arguments", () => {
      const input = "-f -l";
      const arg: Args = new Args("f,l", parseInput(input));

      const hasArgument = arg.has("k");
      expect(hasArgument).toBe(false);
    });
  });

  describe(".cardinality", () => {
    it("should return 0 when empty input was passed in", () => {
      const input = "";
      const arg: Args = new Args("l", parseInput(input));

      const cardinality = arg.cardinality;
      expect(cardinality).toBe(0);
    });

    it.each<[number, string, string]>([
      [1, "-l", "l"],
      [2, "-l -q", "l,q"],
      [10, "-l -q -w -e -r -t -y -u -i -o", "l,q,w,e,r,t,y,u,i,o"],
    ])(
      "should return %p when %p was passed in",
      (numberOfArguments: number, input: string, schema: string) => {
        const arg: Args = new Args(schema, parseInput(input));

        const cardinality = arg.cardinality;
        expect(cardinality).toBe(numberOfArguments);
      }
    );
  });

  describe(".usage", () => {
    it("should return schema when schema is not empty", () => {
      const input = "-l";
      const arg: Args = new Args("l", parseInput(input));

      const usage = arg.usage;
      expect(usage).toBe("[l]");
    });
  });

  describe("exceptions", () => {
    it("should throw INVALID_FORMAT error if schema has unsupported arguments", () => {
      const input = "-l";

      expect(() => new Args("lg", parseInput(input))).toThrowError(Error);
      try {
        new Args("lg", parseInput(input));
      } catch (error) {
        expect(error.code).toBe(ErrorCode.INVALID_FORMAT);
      }
    });

    it("should throw INVALID_SCHEMA error if schema is empty", () => {
      const input = "-l";

      expect(() => new Args("", parseInput(input))).toThrowError(Error);
      try {
        new Args("", parseInput(input));
      } catch (error) {
        expect(error.code).toBe(ErrorCode.INVALID_SCHEMA);
      }
    });

    it("should throw INVALID_ARGUMENT_NAME error if schema has non-string arguments", () => {
      const input = "-l";

      expect(() => new Args("1", parseInput(input))).toThrowError(Error);
      try {
        new Args("1", parseInput(input));
      } catch (error) {
        expect(error.code).toBe(ErrorCode.INVALID_ARGUMENT_NAME);
      }
    });

    it.each<string>(["-p", "-p 5000", "-l -p", "-l -p 5000"])(
      "should throw UNEXPECTED_ARGUMENT error if input is %s and has arguments that are not specified in schema",
      (input) => {
        expect(() => new Args("l", parseInput(input)));
        try {
          new Args("l", parseInput(input));
        } catch (error) {
          expect(error.code).toBe(ErrorCode.UNEXPECTED_ARGUMENT);
        }
      }
    );

    it.each<string>(["hello.txt -f", "-f", "-l -f"])(
      "should throw MISSING_ARGUMENT error if input is %s and has argument without it's parameter",
      (input) => {
        expect(() => new Args("l,f*", parseInput(input)));
        try {
          new Args("l,f*", parseInput(input));
        } catch (error) {
          expect(error.code).toBe(ErrorCode.MISSING_ARGUMENT);
        }
      }
    );

    it("should throw INVALID_NUMBER error if parameter for number argument is not a valid number", () => {
      const input = "-p hello";

      expect(() => new Args("p#", parseInput(input)));
      try {
        new Args("p#", parseInput(input));
      } catch (error) {
        expect(error.code).toBe(ErrorCode.INVALID_NUMBER);
      }
    });
  });
});
