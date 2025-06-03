import TokenUtil from "../utilities/token.util";
import { Request, Response, NextFunction } from "express";

class AuthMidWare {
	private _admin_authenticated = async (req: Request) => {
		try {
			const token = TokenUtil.get_token(req);
			const tokenData = TokenUtil.verify_admin(token);
			if (!tokenData) {
				throw new Error("Token verification failed");
			}
			(req as any).user = tokenData;
		} catch (error: any) {
			throw new Error("Authentication failed: " + error.message);
		}
	};

	private _user_authenticated = async (req: Request) => {
		try {
			const token = TokenUtil.get_token(req);
			const tokenData = TokenUtil.verify_user(token);
			if (!tokenData) {
				throw new Error("Token verification failed");
			}
			(req as any).user = tokenData;
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
			await this._admin_authenticated(req);
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
			await this._user_authenticated(req);
			next();
		} catch (error: any) {
			res.status(401).json({
				message: error.message || "Authentication failed",
			});
		}
	};
}

export default new AuthMidWare();
