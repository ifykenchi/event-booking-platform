import { Response, Request } from "express";
import UserAuthController from "../controllers/userauth.control";
import EventsController from "../controllers/events.control";
import { RootService } from "./_root.service";

class UserService extends RootService {
	register = async (req: Request, res: Response) => {
		try {
			const output = await UserAuthController.register(req.body);
			this.sendResponse({
				res,
				status: 201,
				data: output,
			});
		} catch (error: any) {
			this.sendResponse({
				res,
				status: error.status || 500,
				error,
			});
		}
	};

	login = async (req: Request, res: Response) => {
		try {
			const output = await UserAuthController.login(req.body);
			this.sendResponse({
				res,
				status: 200,
				data: output,
			});
		} catch (error: any) {
			this.sendResponse({
				res,
				status: error.status || 500,
				error,
			});
		}
	};

	getAllEvents = async (req: Request, res: Response) => {
		try {
			const output = await EventsController.getAllEvents();
			this.sendResponse({
				res,
				status: 200,
				data: output,
			});
		} catch (error: any) {
			this.sendResponse({
				res,
				status: error.status || 500,
				error,
			});
		}
	};

	searchEvents = async (req: Request, res: Response) => {
		try {
			const { key, value } = req.query;
			const select = (req.query.select as string) || "";

			const output = await EventsController.searchEvents(
				{ key, value },
				select
			);

			this.sendResponse({
				res,
				status: 200,
				data: output,
			});
		} catch (error: any) {
			this.sendResponse({
				res,
				status: error.status || 500,
				error,
			});
		}
	};
}

export default new UserService();
