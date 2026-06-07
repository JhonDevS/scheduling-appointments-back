module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.js', '!src/**/*.test.js', '!src/**/__tests__/**'],
  testMatch: ['**/__tests__/**/*.test.js', '**/src/**/*.test.js'],
  verbose: true,
  testTimeout: 10000,
  setupFilesAfterEnv: [],
  moduleFileExtensions: ['js', 'json'],
  transform: {},
};
