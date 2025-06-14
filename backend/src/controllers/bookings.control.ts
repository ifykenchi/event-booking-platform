import Booking from "../models/booking.model";
import Event from "../models/event.model";
import { Request, Response } from "express";

class BookingsController {
	getAllBookings = async () => {
		try {
			const bookings = await Booking.find({})
				.populate({
					path: "eventId",
					select: "title category availableSeats bookedSeats,",
				})
				.populate({
					path: "userId",
					select: "username email",
				})
				.sort({ "userId.username": 1 });
			const response = {
				bookings,
				message: "All Bookings Retrieved Successfully",
			};
			return response;
		} catch (error) {
			throw error;
		}
	};
	getUserBookings = async (req: Request) => {
		try {
			const userId = req.params.userId;
			const bookings = await Booking.find({ _id: userId })
				.populate({
					path: "eventId",
					select: "title category availableSeats bookedSeats,",
				})
				.populate({
					path: "userId",
					select: "username, email",
				})
				.sort({ createdOn: 1 });
			const response = {
				bookings,
				message: "User Bookings Retrieved Successfully",
			};
			return response;
		} catch (error) {
			throw error;
		}
	};

	addBooking = async (req: Request) => {
		try {
			const { eventId, userId, userDetails } = req.body;
			const isBooked = await Booking.findOne({ _id: userId });
			if (isBooked) {
				const response = {
					status: 400,
					message: "User has already booked the event",
				};
				throw response;
			}
			const event = await Event.findOne({ _id: eventId });
			if (!event) {
				const response = {
					status: 404,
					message: "Event or User does not exist",
				};
				throw response;
			}
			if (event.bookedSeats >= event.availableSeats) {
				const response = {
					status: 400,
					message: "No seats available for booking",
				};
				return response;
			}
			event.bookedSeats += 1;
			await event.save();

			const booking = new Booking({
				eventId,
				userId,
				userDetails,
			});
			await booking.save();
			const response = {
				booking,
				message: "Booking Created Successfully",
			};
			return response;
		} catch (error) {
			throw error;
		}
	};

	deleteBooking = async (req: Request) => {
		try {
			const bookingId = req.params.bookingId;
			const booking = await Booking.findByIdAndDelete(bookingId);
			if (!booking) {
				const response = {
					status: 404,
					message: "Booking does not exist",
				};
				throw response;
			}
			const response = {
				message: "Booking Deleted Successfully",
			};
			return response;
		} catch (error) {
			throw error;
		}
	};
}

export default new BookingsController();
