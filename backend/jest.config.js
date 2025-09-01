module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleFileExtensions: ["ts", "js"],
	transform: {
		"^.+\\.ts$": "ts-jest",
	},
	testMatch: ["**/*.test.ts"],
	collectCoverage: true,
	collectCoverageFrom: ["src/**/*.ts"],
	coverageDirectory: "coverage",
	coverageReporters: ["text", "lcov"],
	setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
	// setupFiles: ["<rootDir>/tests/setupEnv.ts"],
};
