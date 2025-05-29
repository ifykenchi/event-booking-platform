import { Request, Response } from "express";
import AdminAuthController from "../controllers/adminauth.control";
import AdminEventController from "../controllers/adminevents.control";
import { RootService } from "./_root.service";

class AdminService extends RootService {
	register = async (req: Request, res: Response) => {
		const actionType = "ADMIN_REGISTER";
		try {
			const output = await AdminAuthController.register(req.body);
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
		const actionType = "ADMIN_LOGIN";
		try {
			const output = await AdminAuthController.login(req.body);
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

	addEvent = async (req: Request, res: Response) => {
		const actionType = "ADMIN_ADD_EVENT";
		try {
			const output = await AdminEventController.addEvent(req, res);
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
		const actionType = "ADMIN_GET_ALL_EVENTS";
		try {
			const output = await AdminEventController.getAllEvents(req, res);
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

export default new AdminService();
