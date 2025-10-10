// jest.config.ts
import nextJest from "next/jest";

const createJestConfig = nextJest({
	dir: "./",
});

const customJestConfig = {
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	testEnvironment: "jest-environment-jsdom",
};

export default createJestConfig(customJestConfig);
