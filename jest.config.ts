import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    "^@shared/(.*)$": "<rootDir>/shared/$1",
    "^@web/(.*)$": "<rootDir>/apps/web/$1",
  },
  transform: {
    "^.+\\.(t|j)sx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.json",
      },
    ],
  },
  testMatch: ["<rootDir>/tests/unit/**/*.test.ts"],
  collectCoverage: false,
};

export default config;
