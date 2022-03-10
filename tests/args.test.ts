import Args from "../args";
import { parseInput } from "./test-utils";

describe("Args", () => {
  describe("constructor", () => {
    it("should throw bad character in args error if schema has non-string arguments", () => {
      const input = "-l";

      expect(() => new Args("1", parseInput(input))).toThrowError(Error);
      expect(() => new Args("1", parseInput(input))).toThrowError(
        "Bad character: 1 in Args format: 1"
      );
    });

    it("should throw invalid format error if schema has unsupported arguments", () => {
      const input = "-l";

      expect(() => new Args("lg", parseInput(input))).toThrowError(Error);
      expect(() => new Args("lg", parseInput(input))).toThrowError(
        "Argument: l has invalid format: g"
      );
    });
  });

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

    it("should return false when argument is not in schema", () => {
      const input = "-k";
      const arg: Args = new Args("l", parseInput(input));

      const boolean = arg.getBoolean("k");
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

    it.each<string>(["-l hello.txt -f", "hello.txt -f"])(
      "should return empty string when input is %p and argument is in schema",
      (input) => {
        const arg: Args = new Args("f*", parseInput(input));

        const string = arg.getString("f");
        expect(string).toBe("");
      }
    );

    it("should return empty string when argument is not in schema", () => {
      const input = "-f hello.txt";
      const arg: Args = new Args("l", parseInput(input));

      const string = arg.getString("f");
      expect(string).toBe("");
    });

    it("should return empty string when calling with a non-string argument", () => {
      const input = "-k -d ./";
      const arg: Args = new Args("k,d*", parseInput(input));

      const string = arg.getString("k");
      expect(string).toBe("");
    });
  });

  describe(".getNumber()", () => {
    it("should return number which was passed in after number argument when argument is in schema", () => {
      const input = "-p 5000";
      const arg: Args = new Args("p#", parseInput(input));

      const number = arg.getNumber("p");
      expect(number).toBe(5000);
    });

    it.each<string>(["-l hello.txt -p", "hello.txt -p"])(
      "should return 0 when input is %p and argument is in schema",
      (input) => {
        const arg: Args = new Args("p#", parseInput(input));

        const number = arg.getNumber("p");
        expect(number).toBe(0);
      }
    );

    it("should return 0 when argument is not in schema", () => {
      const input = "-p 5000";
      const arg: Args = new Args("l", parseInput(input));

      const number = arg.getNumber("p");
      expect(number).toBe(0);
    });

    it("should return 0 when parameter is not a valid number", () => {
      const input = "-p hello";
      const arg: Args = new Args("p#", parseInput(input));

      const number = arg.getNumber("p");
      expect(number).toBe(0);
    });

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
      const arg: Args = new Args("l", parseInput(input));

      const hasArgument = arg.has("f");
      expect(hasArgument).toBe(false);
    });

    it("should return false when argument was not found in arguments", () => {
      const input = "-f";
      const arg: Args = new Args("l", parseInput(input));

      const hasArgument = arg.has("l");
      expect(hasArgument).toBe(false);
    });

    it("should return false when argument was not found in schema and arguments", () => {
      const input = "-f";
      const arg: Args = new Args("l", parseInput(input));

      const hasArgument = arg.has("k");
      expect(hasArgument).toBe(false);
    });
  });

  describe(".isValid", () => {
    it("should return true when no schema and no input was passed in", () => {
      const input = "";
      const arg: Args = new Args("", parseInput(input));

      const valid = arg.isValid;
      expect(valid).toBe(true);
    });

    it("should return true when valid input was passed in", () => {
      const input = "-l";
      const arg: Args = new Args("l", parseInput(input));

      const valid = arg.isValid;
      expect(valid).toBe(true);
    });

    it("should return true when empty input was passed in", () => {
      const input = "";
      const arg: Args = new Args("l", parseInput(input));

      const valid = arg.isValid;
      expect(valid).toBe(true);
    });

    it("should return false when invalid input was passed in", () => {
      const input = "-d";
      const arg: Args = new Args("l", parseInput(input));

      const valid = arg.isValid;
      expect(valid).toBe(false);
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

    it("should ignore invalid arguments", () => {
      const input = "-l -d";
      const arg: Args = new Args("l", parseInput(input));

      const cardinality = arg.cardinality;
      expect(cardinality).toBe(1);
    });
  });

  describe(".usage", () => {
    it("should return schema when schema is not empty", () => {
      const input = "-l";
      const arg: Args = new Args("l", parseInput(input));

      const usage = arg.usage;
      expect(usage).toBe("[l]");
    });

    it("should return empty string when schema an empty string", () => {
      const input = "-l";
      const arg: Args = new Args("", parseInput(input));

      const usage = arg.usage;
      expect(usage).toBe("");
    });
  });

  describe(".errorMessage", () => {
    it("should throw TILT error when all arguments are valid", () => {
      const input = "-l";
      const arg: Args = new Args("l", parseInput(input));

      expect(() => arg.errorMessage).toThrowError(Error);
      expect(() => arg.errorMessage).toThrowError("TILT: Should not get here.");
    });

    it.each<[string, string]>([
      ["d", "-l -d"],
      ["p", "-l -p"],
    ])(
      "should return %p argument not found error message when input is %p",
      (missingArgument, input) => {
        const arg: Args = new Args("l,d*,p#", parseInput(input));

        const errorMessage = arg.errorMessage;
        expect(errorMessage).toBe(
          `Could not find parameter for -${missingArgument}.`
        );
      }
    );

    it("should return unexpected argument message when input arguments are not in schema", () => {
      const input = "-l -q";
      const arg: Args = new Args("l", parseInput(input));

      const errorMessage = arg.errorMessage;
      expect(errorMessage).toBe("Argument(s) -q unexpected.");
    });

    it("should return invalid number argument when number argument is not a valid number", () => {
      const input = "-p hello";
      const arg: Args = new Args("p#", parseInput(input));

      const errorMessage = arg.errorMessage;
      expect(errorMessage).toBe("Found invalid number parameter hello for -p.");
    });
  });
});
