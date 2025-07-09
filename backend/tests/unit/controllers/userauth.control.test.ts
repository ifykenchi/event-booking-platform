import UserAuthController from "../../../src/controllers/userauth.control";
import User from "../../../src/models/user.model";
import { hash, isMatch } from "../../../src/utilities/hash.util";
import { CustomRequest } from "../../../src/interfaces/express";
import TokenUtil from "../../../src/utilities/token.util";

jest.mock("../../../src/models/user.model");
jest.mock("../../../src/utilities/hash.util");
jest.mock("../../../src/utilities/token.util");

const mockUser = {
	_id: "507f191e810c19729de860ea",
	username: "testuser",
	email: "user@test.com",
	password: "testpassword",
	save: jest.fn(),
};

describe("UserAuthController", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(User as unknown as jest.Mock).mockImplementation(() => mockUser);
	});

	describe("register", () => {
		it("should register a new user successfully", async () => {
			(User.findOne as jest.Mock).mockResolvedValue(null);
			(hash as jest.Mock).mockResolvedValue("hashedpassword");
			(TokenUtil.register_user as jest.Mock).mockReturnValue("mockToken");
			mockUser.save.mockResolvedValue(mockUser);

			const payload = {
				username: "testuser",
				email: "user@test.com",
				password: "testpassword",
			};

			const result = await UserAuthController.register(payload);

			expect(User.findOne).toHaveBeenCalledWith({ email: "user@test.com" });
			expect(hash).toHaveBeenCalledWith("testpassword");
			expect(mockUser.save).toHaveBeenCalled();
			expect(TokenUtil.register_user).toHaveBeenCalledWith({
				user: mockUser,
			});
			expect(result).toEqual({
				user: mockUser,
				accessToken: "mockToken",
				message: "Registration Successful",
			});
		});

		it("should throw error when user already exists", async () => {
			(User.findOne as jest.Mock).mockResolvedValue(mockUser);

			const payload = {
				username: "testuser",
				email: "user@test.com",
				password: "testpassword",
			};

			await expect(UserAuthController.register(payload)).rejects.toEqual({
				status: 400,
				message: "User already exists",
			});
		});
	});

	describe("login", () => {
		it("should login user successfully with valid credentials", async () => {
			jest.spyOn(UserAuthController, "findOne").mockResolvedValue(mockUser);
			(isMatch as jest.Mock).mockResolvedValue(true);
			(TokenUtil.register_user as jest.Mock).mockReturnValue("mockToken");

			const payload = {
				email: "user@test.com",
				password: "testpassword",
			};

			const result = await UserAuthController.login(payload);

			expect(UserAuthController.findOne).toHaveBeenCalledWith({
				email: "user@test.com",
			});
			expect(isMatch).toHaveBeenCalledWith("testpassword", "hashedpassword");
			expect(TokenUtil.register_user).toHaveBeenCalledWith({
				user: mockUser,
			});
			expect(result).toEqual({
				email: "user@test.com",
				accessToken: "mockToken",
				message: "Login Successful",
			});
		});

		it("should throw error when password is invalid", async () => {
			jest.spyOn(UserAuthController, "findOne").mockResolvedValue(mockUser);
			(isMatch as jest.Mock).mockResolvedValue(false);

			const payload = {
				email: "user@test.com",
				password: "wrongpassword",
			};

			await expect(UserAuthController.login(payload)).rejects.toEqual({
				status: 400,
				message: "Invalid password",
			});
		});

		it("should propagate errors from findOne", async () => {
			jest
				.spyOn(UserAuthController, "findOne")
				.mockRejectedValue(new Error("User not found"));

			const payload = {
				email: "user@test.com",
				password: "testpassword",
			};

			await expect(UserAuthController.login(payload)).rejects.toThrow(
				"User not found"
			);
		});
	});

	describe("getUser", () => {
		it("should return user data when authenticated", async () => {
			const mockRequest = {
				user: {
					user: mockUser,
				},
			} as unknown as CustomRequest;

			const result = await UserAuthController.getUser(mockRequest);

			expect(result).toEqual({
				userData: {
					userId: "507f191e810c19729de860ea",
					username: "testuser",
					email: "user@test.com",
				},
				message: "User Details Have been Sent",
			});
		});

		it("should throw error when not authenticated", async () => {
			const mockRequest = {
				user: null,
			} as unknown as CustomRequest;

			await expect(UserAuthController.getUser(mockRequest)).rejects.toEqual({
				status: 401,
				message: "Unauthorized User",
			});
		});

		it("should throw error when user data is missing", async () => {
			const mockRequest = {
				user: {},
			} as unknown as CustomRequest;

			await expect(UserAuthController.getUser(mockRequest)).rejects.toEqual({
				status: 401,
				message: "Unauthorized User",
			});
		});
	});
});
