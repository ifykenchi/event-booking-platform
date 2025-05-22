import Admin from "../models/admin.model";
import { hash, isMatch } from "../utilities/hash.util";
import TokenUtil from "../utilities/token.util";

class AdminAuthController {
	register = async (payload: any) => {
		try {
			const { username, email, password } = payload;
			const isAdmin = await Admin.findOne({ email: email });
			if (isAdmin) {
				const response = {
					error: true,
					message: "Admin already exists",
				};
				return response;
			}
			const admin = new Admin({
				username,
				email,
				password,
			});
			admin.password = await hash(admin.password);
			await admin.save();
			const accessToken = TokenUtil.register_admin({ admin });
			const response = {
				error: false,
				admin,
				accessToken,
				message: "Admin Registration Successful",
			};
			return response;
		} catch (error) {
			throw error;
		}
	};

	login = async (payload: any) => {
		try {
			const { username, email, password } = payload;
			const isAdmin = await Admin.findOne({ username: username, email: email });

			if (!isAdmin) {
				const response = {
					error: true,
					message: "Invalid username or email",
				};
				return response;
			}

			const validPassword = await isMatch(password, isAdmin.password);

			if (!validPassword) {
				const response = {
					error: true,
					message: "Invalid password",
				};
				return response;
			}

			const admin = { admin: isAdmin };
			const accessToken = TokenUtil.register_user({ admin });
			const response = {
				error: false,
				email,
				accessToken,
				message: "Admin Login Successful",
			};

			return response;
		} catch (error) {
			throw error;
		}
	};
}

export default new AdminAuthController();
