import { Request, Response } from "express";
import AdminAuthController from "../controllers/adminauth.control";
import EventsController from "../controllers/events.control";
import { RootService } from "./_root.service";

class AdminService extends RootService {
	register = async (req: Request, res: Response) => {
		try {
			const output = await AdminAuthController.register(req.body);
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
			const output = await AdminAuthController.login(req.body);
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

	addEvent = async (req: Request, res: Response) => {
		try {
			const output = await EventsController.addEvent(req);
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

	getEvent = async (req: Request, res: Response) => {
		try {
			const output = await EventsController.getEvent(req);
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

	editEvent = async (req: Request, res: Response) => {
		try {
			const output = await EventsController.editEvent(req);
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

	deleteEvent = async (req: Request, res: Response) => {
		try {
			const output = await EventsController.deleteEvent(req);
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

export default new AdminService();
