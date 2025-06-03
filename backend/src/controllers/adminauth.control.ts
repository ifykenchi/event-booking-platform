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
					status: 400,
					message: "Admin already exists",
				};
				throw response;
			}
			const admin = new Admin({
				username,
				email,
				password,
			});
			admin.password = await hash(admin.password);
			await admin.save();
			const newAdmin = { admin: admin };
			const adminToken = TokenUtil.register_admin(newAdmin);
			const response = {
				error: false,
				admin,
				adminToken,
				message: "Admin Registration Successful",
			};
			return response;
		} catch (error) {
			throw error;
		}
	};

	login = async (payload: any) => {
		try {
			const { email, password } = payload;
			const isAdmin = await Admin.findOne({ email: email });

			if (!isAdmin) {
				const response = {
					status: 400,
					message: "Invalid email",
				};
				throw response;
			}

			const validPassword = await isMatch(password, isAdmin.password);

			if (!validPassword) {
				const response = {
					status: 400,
					message: "Invalid password",
				};
				throw response;
			}

			const admin = { admin: isAdmin };
			const adminToken = TokenUtil.register_admin(admin);
			const response = {
				email,
				adminToken,
				message: "Admin Login Successful",
			};

			return response;
		} catch (error) {
			throw error;
		}
	};
}

export default new AdminAuthController();
