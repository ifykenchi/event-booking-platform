import User from "../models/user.model";
import { hash, isMatch } from "../utilities/hash.util";
import TokenUtil from "../utilities/token.util";

class UserAuthController {
	register = async (payload: any) => {
		try {
			const { username, email, password } = payload;
			const isUser = await User.findOne({ email: email });
			if (isUser) {
				const response = {
					error: true,
					message: "User already exists",
				};
				return response;
			}
			const user = new User({
				username,
				email,
				password,
			});
			user.password = await hash(user.password);
			await user.save();

			const accessToken = TokenUtil.register_user({ user });
			const response = {
				error: false,
				user,
				accessToken,
				message: "Registration Successful",
			};

			return response;
		} catch (error) {
			throw error;
		}
	};

	login = async (payload: any) => {
		try {
			const { username, email, password } = payload;
			const isUser = await User.findOne({ username: username, email: email });

			if (!isUser) {
				const response = {
					error: true,
					message: "Invalid username or email",
				};
				return response;
			}

			const validPassword = await isMatch(password, isUser.password);

			if (!validPassword) {
				const response = {
					error: true,
					message: "Invalid password",
				};
				return response;
			}

			const user = { user: isUser };
			const accessToken = TokenUtil.register_user({ user });
			const response = {
				error: false,
				email,
				accessToken,
				message: "Login Successful",
			};

			return response;
		} catch (error) {
			throw error;
		}
	};
}

export default new UserAuthController();
