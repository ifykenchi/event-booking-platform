import Event from "../models/event.model";
import Booking from "../models/booking.model";
import { Request } from "express";

class DashboardController {
	totalEvents = async () => {
		try {
			const totalEvents = await Event.countDocuments({});
			return {
				totalEvents,
				message: "total events sent successfully",
			};
		} catch (error) {
			throw error;
		}
	};

	totalBookings = async () => {
		try {
			const totalBookings = await Booking.countDocuments({ status: true });
			return {
				totalBookings,
				message: "total bookings sent successfully",
			};
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

			const mostBookedEvents =
				aggregationResult.length > 0 ? aggregationResult : null;
			return {
				mostBookedEvents,
				message: "most-booked-events sent successfully",
			};
		} catch (error) {
			throw error;
		}
	};

	totalRevenue = async () => {
		try {
			const result = await Booking.aggregate([
				{
					$match: {
						status: true,
					},
				},
				{
					$group: {
						_id: null,
						totalRevenue: { $sum: "$priceAtBooking" },
					},
				},
			]);

			const totalRevenue = result[0]?.totalRevenue || 0;

			return {
				totalRevenue,
				message: "Total revenue fetched successfully",
			};
		} catch (error) {
			throw error;
		}
	};
}

export default new DashboardController();
