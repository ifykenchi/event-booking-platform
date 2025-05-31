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
					status: 400,
					message: "User already exists",
				};
				throw response;
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
			const { email, password } = payload;
			const isUser = await User.findOne({ email: email });

			if (!isUser) {
				const response = {
					status: 400,
					message: "Invalid email",
				};
				throw response;
			}

			const validPassword = await isMatch(password, isUser.password);

			if (!validPassword) {
				const response = {
					status: 400,
					message: "Invalid password",
				};
				throw response;
			}

			const user = { user: isUser };
			const accessToken = TokenUtil.register_user({ user });
			const response = {
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
