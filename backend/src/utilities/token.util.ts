import * as jwt from "jsonwebtoken";
import env from "../env";

class TokenUtil {
	register_user(payload: any) {
		if (!env.ACCESS_TOKEN_SECRET) {
			throw new Error("ACCESS_TOKEN_SECRET not configured");
		}

		return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
			expiresIn: "1d",
		});
	}

	register_admin(payload: any) {
		if (!env.ADMIN_TOKEN_SECRET) {
			throw new Error("ADMIN_TOKEN_SECRET not configured");
		}

		return jwt.sign(payload, env.ADMIN_TOKEN_SECRET, {
			expiresIn: "1d",
		});
	}
}

export default new TokenUtil();
