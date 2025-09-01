import { Request, Response } from "express";
import AdminAuthController from "../controllers/adminauth.control";
import EventsController from "../controllers/events.control";
import BookingsController from "../controllers/bookings.control";
import DashboardController from "../controllers/dashboard.control";
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
				status: error.status,
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
				status: error.status,
				error,
			});
		}
	};

	getAdmin = async (req: Request, res: Response) => {
		try {
			const output = await AdminAuthController.getAdmin(req);
			this.sendResponse({
				res,
				status: 200,
				data: output,
			});
		} catch (error: any) {
			this.sendResponse({
				res,
				status: error.status,
				error,
			});
		}
	};

	deleteAdmin = async (req: Request, res: Response) => {
		try {
			const output = await AdminAuthController.deleteAdmin(req);
			this.sendResponse({
				res,
				status: 200,
				data: output,
			});
		} catch (error: any) {
			this.sendResponse({
				res,
				status: error.status,
				error,
			});
		}
	};

	addEvent = async (req: Request, res: Response) => {
		try {
			const output = await EventsController.addEvent(req);
			this.sendResponse({
				res,
				status: 201,
				data: output,
			});
		} catch (error: any) {
			this.sendResponse({
				res,
				status: error.status,
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
				status: error.status,
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
				status: error.status,
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
				status: error.status,
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
				status: error.status,
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
				status: error.status,
				error,
			});
		}
	};

	getAllBookings = async (req: Request, res: Response) => {
		try {
			const output = await BookingsController.getAllBookings();
			this.sendResponse({
				res,
				status: 200,
				data: output,
			});
		} catch (error: any) {
			this.sendResponse({
				res,
				status: error.status,
				error,
			});
		}
	};

	deleteBooking = async (req: Request, res: Response) => {
		try {
			const output = await BookingsController.deleteBooking(req);
			this.sendResponse({
				res,
				status: 200,
				data: output,
			});
		} catch (error: any) {
			this.sendResponse({
				res,
				status: error.status,
				error,
			});
		}
	};

	totalEvents = async (req: Request, res: Response) => {
		try {
			const output = await DashboardController.totalEvents();
			this.sendResponse({
				res,
				status: 200,
				data: output,
			});
		} catch (error: any) {
			this.sendResponse({
				res,
				status: error.status,
				error,
			});
		}
	};

	totalBookings = async (req: Request, res: Response) => {
		try {
			const output = await DashboardController.totalBookings();
			this.sendResponse({
				res,
				status: 200,
				data: output,
			});
		} catch (error: any) {
			this.sendResponse({
				res,
				status: error.status,
				error,
			});
		}
	};

	mostBookedEvents = async (req: Request, res: Response) => {
		try {
			const output = await DashboardController.mostBookedEvents();
			this.sendResponse({
				res,
				status: 200,
				data: output,
			});
		} catch (error: any) {
			this.sendResponse({
				res,
				status: error.status,
				error,
			});
		}
	};

	totalRevenue = async (req: Request, res: Response) => {
		try {
			const output = await DashboardController.totalRevenue();
			this.sendResponse({
				res,
				status: 200,
				data: output,
			});
		} catch (error: any) {
			this.sendResponse({
				res,
				status: error.status,
				error,
			});
		}
	};
}

export default new AdminService();
