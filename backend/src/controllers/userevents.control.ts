import Event from "../models/event.model";
import { Request, Response } from "express";

class UserEventController {
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

	searchEvents = async (payload: { key: any; value: any }, select = "") => {
		try {
			if (!payload.key || !payload.value) {
				const response = {
					status: 400,
					message: "Both 'key' and 'value' query parameters are required",
				};
				throw response;
			}
			const regrex = new RegExp(`${payload.value}`, "i");
			const records = await Event.find({
				[payload.key]: { $regex: regrex },
			}).select(select);
			if (!records) throw { message: `${Event.collection.name} not found` };
			// if (!records.length) throw { message: `${Event.collection.name} not found` };
			return records;
		} catch (error) {
			throw error;
		}
	};
}

export default new UserEventController();
