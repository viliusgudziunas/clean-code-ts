import { Config } from "@jest/types";

const config: Config.InitialOptions = {
  moduleNameMapper: { "src/(.*)": "<rootDir>/src/$1" },
  rootDir: "./",
  transform: { "^.+\\.tsx?$": "ts-jest" },
  verbose: true,
};

export default config;
