import Event from "../models/event.model";
import Booking from "../models/booking.model";
import { Request } from "express";

class EventsController {
	addEvent = async (req: Request) => {
		try {
			const { title, about, totalSeats, category } = req.body;
			const event = new Event({
				title,
				about,
				totalSeats,
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
			const events = await Event.find({}).sort({ title: 1 }).lean();
			const bookedSeats = await Booking.aggregate([
				{
					$group: {
						_id: "$eventId",
						count: { $sum: 1 },
					},
				},
			]);
			const bookedSeatsMap = new Map(
				bookedSeats.map((item) => [item._id.toString(), item.count])
			);
			const eventsWithAvailability = events.map((event) => ({
				...event,
				availableSeats:
					event.totalSeats - (bookedSeatsMap.get(event._id.toString()) || 0),
			}));
			const response = {
				events: eventsWithAvailability,
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
			const bookedSeats = await Booking.countDocuments({ eventId: eventId });
			const availableSeats = event.totalSeats - bookedSeats;
			const eventWithAvailability = {
				...event.toObject(),
				availableSeats: availableSeats,
			};
			const response = {
				event: eventWithAvailability,
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
			const { title, about, totalSeats, category } = req.body;

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
			if (totalSeats) event.totalSeats = totalSeats;
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

			const events = await Event.find(query)
				.select(select)
				.sort({ title: 1 })
				.lean();
			if (!events) throw { message: `${Event.collection.name} not found` };
			// if (!events.length) throw { message: `${Event.collection.name} not found` };
			const bookedSeats = await Booking.aggregate([
				{
					$match: {
						eventId: { $in: events.map((event) => event._id) },
					},
				},
				{
					$group: {
						_id: "$eventId",
						count: { $sum: 1 },
					},
				},
			]);

			const bookedSeatsMap = new Map(
				bookedSeats.map((item) => [item._id.toString(), item.count])
			);

			const eventsWithAvailability = events.map((event) => ({
				...event,
				availableSeats:
					event.totalSeats - (bookedSeatsMap.get(event._id.toString()) || 0),
			}));

			return eventsWithAvailability;
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
