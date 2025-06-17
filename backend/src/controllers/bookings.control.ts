import Booking from "../models/booking.model";
import Event from "../models/event.model";
import mongoose from "mongoose";
import { Request, Response } from "express";

class BookingsController {
	getAllBookings = async () => {
		try {
			const bookings = await Booking.find({})
				.populate({
					path: "eventId",
					select: "title category availableSeats bookedSeats",
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
			const bookings = await Booking.find({ userId: userId })
				.populate({
					path: "eventId",
					select: "title category availableSeats bookedSeats",
				})
				.populate({
					path: "userId",
					select: "username email",
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
		const session = await mongoose.startSession();
		session.startTransaction();
		try {
			const { eventId, userId, userDetails } = req.body;
			const existingBooking = await Booking.findOne({
				userId: userId,
				eventId: eventId,
			}).session(session);

			if (existingBooking) {
				await session.abortTransaction();
				const response = {
					status: 400,
					message: "User has already booked the event",
				};
				throw response;
			}

			const event = await Event.findOne({ _id: eventId }).session(session);
			if (!event) {
				await session.abortTransaction();
				const response = {
					status: 404,
					message: "Event does not exist",
				};
				throw response;
			}
			if (event.bookedSeats >= event.availableSeats) {
				await session.abortTransaction();
				const response = {
					status: 400,
					message: "No seats available for booking",
				};
				throw response;
			}

			await Event.updateOne(
				{ _id: eventId },
				{ $inc: { bookedSeats: 1 } },
				{ session }
			);

			const [booking] = await Booking.create(
				[
					{
						eventId,
						userId,
						userDetails,
					},
				],
				{ session }
			);

			await session.commitTransaction();

			const response = {
				booking,
				message: "Booking Created Successfully",
			};
			return response;
		} catch (error) {
			if (session.inTransaction()) {
				await session.abortTransaction();
			}
			throw error;
		} finally {
			session.endSession();
		}
	};

	deleteBooking = async (req: Request) => {
		const session = await mongoose.startSession();
		session.startTransaction();

		try {
			const bookingId = req.params.bookingId;
			const booking = await Booking.findOne({ _id: bookingId }).session(
				session
			);
			if (!booking) {
				await session.abortTransaction();
				const response = {
					status: 404,
					message: "Booking does not exist",
				};
				throw response;
			}

			const event = await Event.findOne({ _id: booking.eventId }).session(
				session
			);
			if (!event) {
				await session.abortTransaction();
				const response = {
					status: 404,
					message: "Event does not exist",
				};
				throw response;
			}
			if (event.bookedSeats <= 0) {
				await session.abortTransaction();
				const response = {
					status: 400,
					message: "No Booked Seats to Delete",
				};
				throw response;
			}

			await Event.updateOne(
				{ _id: event._id },
				{ $inc: { bookedSeats: -1 } },
				{ session }
			);

			await Booking.deleteOne({ _id: bookingId }, { session });

			await session.commitTransaction();

			const response = {
				message: "Booking Deleted Successfully",
			};
			return response;
		} catch (error) {
			if (session.inTransaction()) {
				await session.abortTransaction();
			}
			throw error;
		} finally {
			session.endSession();
		}
	};
}

export default new BookingsController();
