import { Response, Request } from "express";
import UserAuthController from "../controllers/userauth.control";
import UserEventController from "../controllers/userevents.control";
import { RootService } from "./_root.service";

class UserService extends RootService {
	register = async (req: Request, res: Response) => {
		const actionType = "USER_REGISTER";
		try {
			const output = await UserAuthController.register(req.body);
			this.sendResponse({
				res,
				status: 201,
				data: output,
				actionType,
			});
		} catch (error: any) {
			this.sendResponse({
				res,
				status: error.status || 500,
				error,
				actionType,
			});
		}
	};

	login = async (req: Request, res: Response) => {
		const actionType = "USER_LOGIN";
		try {
			const output = await UserAuthController.login(req.body);
			this.sendResponse({
				res,
				status: 200,
				data: output,
				actionType,
			});
		} catch (error: any) {
			this.sendResponse({
				res,
				status: error.status || 500,
				error,
				actionType,
			});
		}
	};

	getAllEvents = async (req: Request, res: Response) => {
		const actionType = "USER_GET_ALL_EVENTS";
		try {
			const output = await UserEventController.getAllEvents();
			this.sendResponse({
				res,
				status: 200,
				data: output,
				actionType,
			});
		} catch (error: any) {
			this.sendResponse({
				res,
				status: error.status || 500,
				error,
				actionType,
			});
		}
	};

	searchEvents = async (req: Request, res: Response) => {
		const actionType = "USER_SEARCH_EVENTS";
		try {
			const { key, value } = req.query;
			const select = (req.query.select as string) || "";

			const output = await UserEventController.searchEvents(
				{ key, value },
				select
			);

			this.sendResponse({
				res,
				status: 200,
				data: output,
				actionType,
			});
		} catch (error: any) {
			this.sendResponse({
				res,
				status: error.status || 500,
				error,
				actionType,
			});
		}
	};
}

export default new UserService();
