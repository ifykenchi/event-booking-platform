import { Response, Request } from "express";
import UserAuthController from "../controllers/userauth.control";

class UserService {
	register = async (req: Request, res: Response) => {
		try {
			const output = await UserAuthController.register(req.body);

			if (output.error) {
				res.status(400).json(output);
			}

			res.status(201).json(output);
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	};

	login = async (req: Request, res: Response) => {
		try {
			const output = await UserAuthController.login(req.body);

			if (output.error) {
				res.status(400).json(output);
			}

			res.status(200).json(output);
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	};
}

export default new UserService();
