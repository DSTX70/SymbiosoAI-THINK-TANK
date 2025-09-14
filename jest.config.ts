import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transform: { '^.+\\.(ts|tsx)$': 'ts-jest' },
  collectCoverageFrom: ['server/**/*.{ts,tsx}', '!server/**/index.{ts,tsx}'],
  coverageReporters: ['text', 'lcov'],
  reporters: ['default', 'jest-junit'],
};

export default config;