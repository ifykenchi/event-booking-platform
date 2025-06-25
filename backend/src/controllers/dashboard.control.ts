import Event from "../models/event.model";
import Booking from "../models/booking.model";
import { Request } from "express";

class DashboardController {
	totalEvents = async () => {
		try {
			const totalEvents = await Event.countDocuments({});
			const response = {
				totalEvents,
				message: "total events sent successfully",
			};
			return response;
		} catch (error) {
			throw error;
		}
	};

	totalBookings = async () => {
		try {
			const totalBookings = await Booking.countDocuments({ status: true });
			const response = {
				totalBookings,
				message: "total bookings sent successfully",
			};
			return response;
		} catch (error) {
			throw error;
		}
	};

	mostBookedEvents = async () => {
		try {
			const aggregationResult = await Booking.aggregate([
				{ $match: { status: true } },
				{ $group: { _id: "$eventId", bookingCount: { $sum: 1 } } },
				{ $sort: { bookingCount: -1 } },
				{
					$group: {
						_id: null,
						maxCount: { $first: "$bookingCount" },
						events: { $push: "$$ROOT" },
					},
				},
				{ $unwind: "$events" },
				{
					$redact: {
						$cond: {
							if: { $eq: ["$events.bookingCount", "$maxCount"] },
							then: "$$KEEP",
							else: "$$PRUNE",
						},
					},
				},
				{
					$lookup: {
						from: "events",
						localField: "events._id",
						foreignField: "_id",
						as: "eventDetails",
					},
				},
				{ $unwind: "$eventDetails" },
				{
					$project: {
						eventId: "$events._id",
						title: "$eventDetails.title",
						bookingCount: "$events.bookingCount",
						totalSeats: "$eventDetails.totalSeats",
						_id: 0,
					},
				},
			]);

			return aggregationResult.length > 0 ? aggregationResult : null;
		} catch (error) {
			throw error;
		}
	};
}

export default new DashboardController();
