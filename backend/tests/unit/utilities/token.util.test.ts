import jwt from "jsonwebtoken";
import TokenUtil from "../../../src/utilities/token.util";
import env from "../../../src/env";
import { Request } from "express";

jest.mock("jsonwebtoken");

jest.mock("../../../src/env", () => ({
	ACCESS_TOKEN_SECRET: "test_access_secret",
	ADMIN_TOKEN_SECRET: "test_admin_secret",
}));

describe("TokenUtil", () => {
	const mockPayload = { userId: 123, email: "test@example.com" };
	const mockToken = "mock.token.value";
	const mockRequest = {
		headers: {
			authorization: "Bearer mock.token.value",
		},
	} as Request;

	beforeEach(() => {
		(env as any).ACCESS_TOKEN_SECRET = "test_access_secret";
		(env as any).ADMIN_TOKEN_SECRET = "test_admin_secret";
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("register_user", () => {
		it("should generate a user token with correct payload and secret", () => {
			(jwt.sign as jest.Mock).mockReturnValue(mockToken);

			const result = TokenUtil.register_user(mockPayload);

			expect(jwt.sign).toHaveBeenCalledWith(
				mockPayload,
				env.ACCESS_TOKEN_SECRET,
				{ expiresIn: "36000m" }
			);
			expect(result).toBe(mockToken);
		});

		it("should throw error when ACCESS_TOKEN_SECRET is not configured", () => {
			(env as any).ACCESS_TOKEN_SECRET = undefined;

			expect(() => TokenUtil.register_user(mockPayload)).toThrow(
				"ACCESS_TOKEN_SECRET not configured"
			);
		});
	});

	describe("register_admin", () => {
		it("should generate an admin token with correct payload and secret", () => {
			(jwt.sign as jest.Mock).mockReturnValue(mockToken);

			const result = TokenUtil.register_admin(mockPayload);

			expect(jwt.sign).toHaveBeenCalledWith(
				mockPayload,
				env.ADMIN_TOKEN_SECRET,
				{ expiresIn: "36000m" }
			);
			expect(result).toBe(mockToken);
		});

		it("should throw error when ADMIN_TOKEN_SECRET is not configured", () => {
			(env as any).ADMIN_TOKEN_SECRET = undefined;

			expect(() => TokenUtil.register_admin(mockPayload)).toThrow(
				"ADMIN_TOKEN_SECRET not configured"
			);
		});
	});

	describe("get_token", () => {
		it("should extract token from Authorization header", () => {
			const result = TokenUtil.get_token(mockRequest);
			expect(result).toBe("mock.token.value");
		});

		it("should throw error when Authorization header is missing", () => {
			const req = { headers: {} } as Request;
			expect(() => TokenUtil.get_token(req)).toThrow(
				"Authorization header is missing or invalid"
			);
		});
	});

	describe("verify_user", () => {
		it("should verify user token with correct secret", () => {
			const mockDecoded = { ...mockPayload, iat: 1234567890 };
			(jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

			const result = TokenUtil.verify_user(mockToken);

			expect(jwt.verify).toHaveBeenCalledWith(
				mockToken,
				env.ACCESS_TOKEN_SECRET
			);
			expect(result).toEqual(mockDecoded);
		});

		it("should throw error when ACCESS_TOKEN_SECRET is not configured", () => {
			(env as any).ACCESS_TOKEN_SECRET = undefined;

			expect(() => TokenUtil.verify_user(mockToken)).toThrow(
				"ACCESS_TOKEN_SECRET not configured"
			);
		});

		it("should throw error when token is invalid", () => {
			const mockError = new Error("Invalid token");
			(jwt.verify as jest.Mock).mockImplementation(() => {
				throw mockError;
			});

			expect(() => TokenUtil.verify_user("invalid.token")).toThrow(
				"Invalid token"
			);
		});
	});

	describe("verify_admin", () => {
		it("should verify admin token with correct secret", () => {
			const mockDecoded = { ...mockPayload, iat: 1234567890 };
			(jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

			const result = TokenUtil.verify_admin(mockToken);

			expect(jwt.verify).toHaveBeenCalledWith(
				mockToken,
				env.ADMIN_TOKEN_SECRET
			);
			expect(result).toEqual(mockDecoded);
		});

		it("should throw error when ADMIN_TOKEN_SECRET is not configured", () => {
			(env as any).ADMIN_TOKEN_SECRET = undefined;

			expect(() => TokenUtil.verify_admin(mockToken)).toThrow(
				"ADMIN_TOKEN_SECRET not configured"
			);
		});

		it("should throw error when token is invalid", () => {
			const mockError = new Error("Invalid token");
			(jwt.verify as jest.Mock).mockImplementation(() => {
				throw mockError;
			});

			expect(() => TokenUtil.verify_admin("invalid.token")).toThrow(
				"Invalid token"
			);
		});
	});
});
