import { Request, Response } from "express";
import AdminAuthController from "../controllers/adminauth.control";

class AdminService {
	register = async (req: Request, res: Response) => {
		try {
			const output = await AdminAuthController.register(req.body);

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
			const output = await AdminAuthController.login(req.body);

			if (output.error) {
				res.status(400).json(output);
			}

			res.status(200).json(output);
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	};
}

export default new AdminService();
