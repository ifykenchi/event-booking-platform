import TokenUtil from "../utilities/token.util";
import { Request, Response, NextFunction } from "express";

class AuthMidWare {
	private _is_authenticated = async (req: Request, role: string) => {
		try {
			const authHeader = req.headers.authorization;
			if (!authHeader) {
				throw new Error("Authorization header is missing or invalid");
			}
			const token = authHeader.split(" ")[1];
			if (role === "admin") {
				const tokenData = TokenUtil.verify_admin(token);
				if (!tokenData) {
					throw new Error("Token verification failed");
				}
				(req as any).user = tokenData;
			}
			if (role === "user") {
				const tokenData = TokenUtil.verify_user(token);
				if (!tokenData) {
					throw new Error("Token verification failed");
				}
				(req as any).user = tokenData;
			}
		} catch (error: any) {
			throw new Error("Authentication failed: " + error.message);
		}
	};

	authAdmin = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			await this._is_authenticated(req, "admin");
			next();
		} catch (error: any) {
			res.status(401).json({
				message: error.message || "Authentication failed",
			});
		}
	};

	authUser = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			await this._is_authenticated(req, "user");
			next();
		} catch (error: any) {
			res.status(401).json({
				message: error.message || "Authentication failed",
			});
		}
	};
}

export default new AuthMidWare();
