import * as jwt from "jsonwebtoken";
import env from "../env";
import { Request } from "express";

class TokenUtil {
	register_user(payload: any) {
		if (!env.ACCESS_TOKEN_SECRET) {
			throw new Error("ACCESS_TOKEN_SECRET not configured");
		}

		return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
			expiresIn: "36000m",
		});
	}

	register_admin(payload: any) {
		if (!env.ADMIN_TOKEN_SECRET) {
			throw new Error("ADMIN_TOKEN_SECRET not configured");
		}

		return jwt.sign(payload, env.ADMIN_TOKEN_SECRET, {
			expiresIn: "36000m",
		});
	}

	get_token(req: Request) {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			throw new Error("Authorization header is missing or invalid");
		}
		const token = authHeader.split(" ")[1];
		return token;
	}

	verify_user(token: string) {
		try {
			if (!env.ACCESS_TOKEN_SECRET) {
				throw new Error("ACCESS_TOKEN_SECRET not configured");
			}
			const response = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
			return response;
		} catch (error) {
			throw { error, message: "You are not authorized" };
		}
	}

	verify_admin(token: string) {
		try {
			if (!env.ADMIN_TOKEN_SECRET) {
				throw new Error("ADMIN_TOKEN_SECRET not configured");
			}
			const response = jwt.verify(token, env.ADMIN_TOKEN_SECRET);
			return response;
		} catch (error) {
			throw { error, message: "You are not authorized" };
		}
	}
}

export default new TokenUtil();
