import Event from "../models/event.model";
import { Request } from "express";

class AdminEventController {
	addEvent = async (req: Request) => {
		try {
			const { title, about, category } = req.body;
			const event = new Event({
				title,
				about,
				category,
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

	getAllEvents = async () => {
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

	getEvent = async (req: Request) => {
		try {
			const eventId = req.params.eventId;
			const event = await Event.findOne({ _id: eventId });
			if (!event) {
				const response = {
					status: 404,
					message: "Event does not exist",
				};
				throw response;
			}
			const response = {
				event,
				message: "Event Get Successful",
			};
			return response;
		} catch (error) {
			throw error;
		}
	};

	editEvent = async (req: Request) => {
		try {
			const eventId = req.params.eventId;
			const { title, about, category } = req.body;

			// const { user } = req.user;
			const event = await Event.findOne({ _id: eventId });
			if (!event) {
				const response = {
					status: 404,
					message: "Event does not exist",
				};
				throw response;
			}
			if (title) event.title = title;
			if (about) event.about = about;
			if (category) event.category = category;
			await event.save();
			const response = {
				event,
				message: "Event Edited Successfully",
			};
			return response;
		} catch (error) {
			throw error;
		}
	};

	deleteEvent = async (req: Request) => {
		try {
			const eventId = req.params.eventId;
			const event = await Event.findOne({ _id: eventId });
			if (!event) {
				const response = {
					status: 404,
					message: "Event does not exist",
				};
				throw response;
			}
			await event.deleteOne({ _id: eventId });
			const response = {
				message: "Event Deleted Successfully",
			};
			return response;
		} catch (error) {
			throw error;
		}
	};
}

export default new AdminEventController();
