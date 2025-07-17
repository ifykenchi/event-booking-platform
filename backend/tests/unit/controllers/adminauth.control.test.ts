import AdminAuthController from "../../../src/controllers/adminauth.control";
import Admin from "../../../src/models/admin.model";
import { hash, isMatch } from "../../../src/utilities/hash.util";
import { CustomRequest } from "../../../src/interfaces/express";
import TokenUtil from "../../../src/utilities/token.util";

jest.mock("../../../src/models/admin.model");
jest.mock("../../../src/utilities/hash.util");
jest.mock("../../../src/utilities/token.util");

const mockAdmin = {
	_id: "507f191e810c19729de860ea",
	username: "testadmin",
	email: "admin@test.com",
	password: "testpassword",
	save: jest.fn(),
};

describe("AdminAuthController", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(Admin as unknown as jest.Mock).mockImplementation(() => mockAdmin);
	});

	describe("register", () => {
		it("should register a new admin successfully", async () => {
			(Admin.findOne as jest.Mock).mockResolvedValue(null);
			(hash as jest.Mock).mockResolvedValue("hashedpassword");
			(TokenUtil.register_admin as jest.Mock).mockReturnValue("mockToken");
			mockAdmin.save.mockResolvedValue(mockAdmin);

			const payload = {
				username: "testadmin",
				email: "admin@test.com",
				password: "testpassword",
			};

			const result = await AdminAuthController.register(payload);

			expect(Admin.findOne).toHaveBeenCalledWith({ email: "admin@test.com" });
			expect(hash).toHaveBeenCalledWith("testpassword");
			expect(mockAdmin.save).toHaveBeenCalled();
			expect(TokenUtil.register_admin).toHaveBeenCalledWith({
				admin: mockAdmin,
			});
			expect(result).toEqual({
				admin: mockAdmin,
				adminToken: "mockToken",
				message: "Admin Registration Successful",
			});
		});

		it("should throw error when admin already exists", async () => {
			(Admin.findOne as jest.Mock).mockResolvedValue(mockAdmin);

			const payload = {
				username: "testadmin",
				email: "admin@test.com",
				password: "testpassword",
			};

			await expect(AdminAuthController.register(payload)).rejects.toEqual({
				status: 400,
				message: "Admin already exists",
			});
		});
	});

	describe("login", () => {
		it("should login admin successfully with valid credentials", async () => {
			jest.spyOn(AdminAuthController, "findOne").mockResolvedValue(mockAdmin);
			(isMatch as jest.Mock).mockResolvedValue(true);
			(TokenUtil.register_admin as jest.Mock).mockReturnValue("mockToken");

			const payload = {
				email: "admin@test.com",
				password: "testpassword",
			};

			const result = await AdminAuthController.login(payload);

			expect(AdminAuthController.findOne).toHaveBeenCalledWith({
				email: "admin@test.com",
			});
			expect(isMatch).toHaveBeenCalledWith("testpassword", "hashedpassword");
			expect(TokenUtil.register_admin).toHaveBeenCalledWith({
				admin: mockAdmin,
			});
			expect(result).toEqual({
				email: "admin@test.com",
				adminToken: "mockToken",
				message: "Admin Login Successful",
			});
		});

		it("should throw error when password is invalid", async () => {
			jest.spyOn(AdminAuthController, "findOne").mockResolvedValue(mockAdmin);
			(isMatch as jest.Mock).mockResolvedValue(false);

			const payload = {
				email: "admin@test.com",
				password: "wrongpassword",
			};

			await expect(AdminAuthController.login(payload)).rejects.toEqual({
				status: 400,
				message: "Invalid password",
			});
		});
	});

	describe("getAdmin", () => {
		it("should return admin data when authenticated", async () => {
			const mockRequest = {
				user: {
					admin: mockAdmin,
				},
			} as unknown as CustomRequest;

			const result = await AdminAuthController.getAdmin(mockRequest);

			expect(result).toEqual({
				adminData: {
					userId: "507f191e810c19729de860ea",
					username: "testadmin",
					email: "admin@test.com",
				},
				message: "Admin Details Have been Sent",
			});
		});

		it("should throw error when not authenticated", async () => {
			const mockRequest = {
				user: null,
			} as unknown as CustomRequest;

			await expect(AdminAuthController.getAdmin(mockRequest)).rejects.toEqual({
				status: 401,
				message: "Unauthorized User",
			});
		});

		it("should throw error when admin data is missing", async () => {
			const mockRequest = {
				user: {},
			} as unknown as CustomRequest;

			await expect(AdminAuthController.getAdmin(mockRequest)).rejects.toEqual({
				status: 401,
				message: "Unauthorized User",
			});
		});
	});
});
