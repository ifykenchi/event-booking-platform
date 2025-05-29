import * as jwt from "jsonwebtoken";
import env from "../env";

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
