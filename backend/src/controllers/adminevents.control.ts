import Event from "../models/event.model";
import { Request, Response } from "express";

class AdminEventController {
	addEvent = async (req: Request, _res: Response) => {
		try {
			const { title, about, userId, createdOn } = req.body;
			const event = new Event({
				title,
				about,
				userId,
				createdOn,
			});
			await event.save();
			const response = {
				event,
				message: "Event Created Successfully",
			};
			return response;
		} catch (error) {
			throw error;
		}
	};

	getAllEvents = async (req: Request, res: Response) => {
		try {
			const events = await Event.find({}).sort({ title: 1 });
			const response = {
				events,
				message: "All Events Retrieved Successfully",
			};
			return response;
		} catch (error) {
			throw error;
		}
	};
}

export default new AdminEventController();
