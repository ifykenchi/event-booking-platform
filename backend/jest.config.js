module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleFileExtensions: ["ts", "js"],
	transform: {
		"^.+\\.ts$": "ts-jest",
	},
	testMatch: ["**/*.test.ts"],
	collectCoverage: true,
	collectCoverageFrom: ["src/controllers/**/*.ts"],
	coverageDirectory: "coverage",
	coverageReporters: ["text", "lcov"],
};
