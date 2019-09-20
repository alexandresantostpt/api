module.exports = {
    bail: true,
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.{ts}",
        "!**/node_modules/**"
    ],
    coverageDirectory: "coverage",
    coveragePathIgnorePatterns: [
        "/coverage/",
        "/node_modules/"
    ],
    coverageReporters: [
        "html",
        "json"
    ],
    coverageThreshold: {
        "global": {
            "branches": 0,
            "functions": 0,
            "lines": 0,
            "statements": 0
        }
    },
    errorOnDeprecated: true,
    globals: {},
    moduleDirectories: [
        "node_modules"
    ],
    moduleFileExtensions: [
        "js",
        "ts"
    ],
    moduleNameMapper: {
        "@/(.*)$": "<rootDir>/src/$1",
        "@config/(.*)$": "<rootDir>/src/_config/$1",
        "@constants/(.*)$": "<rootDir>/src/constants/$1",
        "@env/(.*)$": "<rootDir>/src/_environments/$1",
        "@features/(.*)$": "<rootDir>/src/features/$1",
        "@i18n": "<rootDir>/src/_translate/i18n",
        "@utils/(.*)$": "<rootDir>/src/utils/$1"
    },
    notify: false,
    preset: 'ts-jest',
    resetMocks: true,
    resetModules: true,
    setupFiles: [],
    testEnvironment: "node",
    testMatch: [
        "<rootDir>/src/**/__tests__/**/*(test).ts",
        "<rootDir>/src/**/?(*.)(test).ts"
    ],
    testPathIgnorePatterns: [
        "/coverage/",
        "/node_modules/"
    ],
    testURL: 'http://localhost:8080/v1/api/',
    transform: {},
    transformIgnorePatterns: [
        "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts)$"
    ],
    verbose: true
}
