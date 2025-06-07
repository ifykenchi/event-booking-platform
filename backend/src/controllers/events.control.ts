import Event from "../models/event.model";
import { Request } from "express";

class EventsController {
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

	searchEvents = async (payload: { key: any; value: any }, select = "") => {
		try {
			if (!payload.key || !payload.value) {
				const response = {
					status: 400,
					message: "Both 'key' and 'value' query parameters are required",
				};
				throw response;
			}
			let query = {};

			if (payload.value === "ALL") {
				query = { [payload.key]: { $exists: true } };
			} else {
				const regrex = new RegExp(`${payload.value}`, "i");
				query = { [payload.key]: { $regex: regrex } };
			}

			const records = await Event.find(query).select(select);
			if (!records) throw { message: `${Event.collection.name} not found` };
			// if (!records.length) throw { message: `${Event.collection.name} not found` };
			return records;
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

export default new EventsController();
