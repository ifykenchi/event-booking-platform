import AuthMidWare from "../../../src/middlewares/auth.midware";
import TokenUtil from "../../../src/utilities/token.util";
import { Request, Response, NextFunction } from "express";

jest.mock("../../../src/utilities/token.util");

describe("AuthMidWare", () => {
	let req: any;
	let res: any;
	let next: jest.Mock;

	beforeEach(() => {
		req = {};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		next = jest.fn();
		jest.clearAllMocks();
	});

	describe("authAdmin", () => {
		it("should call next if admin token is valid", async () => {
			(TokenUtil.get_token as jest.Mock).mockReturnValue("valid-token");
			(TokenUtil.verify_admin as jest.Mock).mockReturnValue({ id: "admin1" });

			await AuthMidWare.authAdmin(req, res, next);

			expect(TokenUtil.get_token).toHaveBeenCalledWith(req);
			expect(TokenUtil.verify_admin).toHaveBeenCalledWith("valid-token");
			expect(req.user).toEqual({ id: "admin1" });
			expect(next).toHaveBeenCalled();
			expect(res.status).not.toHaveBeenCalled();
		});

		it("should return 401 if token verification fails", async () => {
			(TokenUtil.get_token as jest.Mock).mockReturnValue("invalid-token");
			(TokenUtil.verify_admin as jest.Mock).mockReturnValue(null);

			await AuthMidWare.authAdmin(req, res, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({
				message: expect.stringContaining("Token verification failed"),
			});
			expect(next).not.toHaveBeenCalled();
		});

		it("should return 401 if get_token throws", async () => {
			(TokenUtil.get_token as jest.Mock).mockImplementation(() => {
				throw new Error("No token");
			});

			await AuthMidWare.authAdmin(req, res, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({
				message: expect.stringContaining("Authentication failed"),
			});
			expect(next).not.toHaveBeenCalled();
		});
	});

	describe("authUser", () => {
		it("should call next if user token is valid", async () => {
			(TokenUtil.get_token as jest.Mock).mockReturnValue("valid-token");
			(TokenUtil.verify_user as jest.Mock).mockReturnValue({ id: "user1" });

			await AuthMidWare.authUser(req, res, next);

			expect(TokenUtil.get_token).toHaveBeenCalledWith(req);
			expect(TokenUtil.verify_user).toHaveBeenCalledWith("valid-token");
			expect(req.user).toEqual({ id: "user1" });
			expect(next).toHaveBeenCalled();
			expect(res.status).not.toHaveBeenCalled();
		});

		it("should return 401 if token verification fails", async () => {
			(TokenUtil.get_token as jest.Mock).mockReturnValue("invalid-token");
			(TokenUtil.verify_user as jest.Mock).mockReturnValue(null);

			await AuthMidWare.authUser(req, res, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({
				message: expect.stringContaining("Token verification failed"),
			});
			expect(next).not.toHaveBeenCalled();
		});

		it("should return 401 if get_token throws", async () => {
			(TokenUtil.get_token as jest.Mock).mockImplementation(() => {
				throw new Error("No token");
			});

			await AuthMidWare.authUser(req, res, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({
				message: expect.stringContaining("Authentication failed"),
			});
			expect(next).not.toHaveBeenCalled();
		});
	});
});
