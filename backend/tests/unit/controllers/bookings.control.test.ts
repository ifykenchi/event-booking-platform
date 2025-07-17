import BookingsController from "../../../src/controllers/bookings.control";
import Booking from "../../../src/models/booking.model";
import Event from "../../../src/models/event.model";
import mongoose from "mongoose";

jest.mock("../../../src/models/booking.model");
jest.mock("../../../src/models/event.model");
jest.mock("mongoose", () => {
	const actualMongoose = jest.requireActual("mongoose");
	return {
		...actualMongoose,
		startSession: jest.fn(),
	};
});

const mockSession = {
	startTransaction: jest.fn(),
	commitTransaction: jest.fn(),
	abortTransaction: jest.fn(),
	endSession: jest.fn(),
};

describe("BookingsController", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(mongoose.startSession as jest.Mock).mockResolvedValue(mockSession);
	});

	describe("getAllBookings", () => {
		it("should return all bookings with populated fields", async () => {
			const bookings = [{ _id: "1" }, { _id: "2" }];
			const populateMock = jest.fn().mockReturnThis();
			const sortMock = jest.fn().mockResolvedValue(bookings);
			(Booking.find as jest.Mock).mockReturnValue({
				populate: populateMock,
				sort: sortMock,
			});

			const result = await BookingsController.getAllBookings();

			expect(Booking.find).toHaveBeenCalledWith({});
			expect(populateMock).toHaveBeenCalledTimes(2);
			expect(sortMock).toHaveBeenCalledWith({ "userId.username": 1 });
			expect(result).toEqual({
				bookings,
				message: "All Bookings Retrieved Successfully",
			});
		});

		it("should throw error if Booking.find fails", async () => {
			(Booking.find as jest.Mock).mockImplementation(() => {
				throw new Error("DB error");
			});

			await expect(BookingsController.getAllBookings()).rejects.toThrow(
				"DB error"
			);
		});
	});

	describe("getUserBookings", () => {
		it("should return bookings for a user", async () => {
			const bookings = [{ _id: "1" }];
			const req = { params: { userId: "user1" } } as any;
			const populateMock = jest.fn().mockReturnThis();
			const sortMock = jest.fn().mockResolvedValue(bookings);
			(Booking.find as jest.Mock).mockReturnValue({
				populate: populateMock,
				sort: sortMock,
			});

			const result = await BookingsController.getUserBookings(req);

			expect(Booking.find).toHaveBeenCalledWith({ userId: "user1" });
			expect(populateMock).toHaveBeenCalledTimes(2);
			expect(sortMock).toHaveBeenCalledWith({ createdOn: 1 });
			expect(result).toEqual({
				bookings,
				message: "User Bookings Retrieved Successfully",
			});
		});

		it("should throw error if Booking.find fails", async () => {
			const req = { params: { userId: "user1" } } as any;
			(Booking.find as jest.Mock).mockImplementation(() => {
				throw new Error("DB error");
			});

			await expect(BookingsController.getUserBookings(req)).rejects.toThrow(
				"DB error"
			);
		});
	});

	describe("addBooking", () => {
		const req = {
			body: {
				eventId: "event1",
				userId: "user1",
				userDetails: { name: "Test" },
			},
		} as any;

		it("should create a new booking successfully", async () => {
			const event = { _id: "event1", price: 100, totalSeats: 10 };
			(Event.findOne as jest.Mock).mockReturnValue({
				session: jest.fn().mockResolvedValue(event),
			});
			(Booking.findOne as jest.Mock).mockReturnValue({
				session: jest.fn().mockResolvedValue(null),
			});
			(Booking.countDocuments as jest.Mock).mockResolvedValue(2);
			(Booking.create as jest.Mock).mockResolvedValue([{ _id: "booking1" }]);

			const result = await BookingsController.addBooking(req);

			expect(result).toEqual({
				booking: { _id: "booking1" },
				message: "Booking Created Successfully",
			});
			expect(mockSession.commitTransaction).toHaveBeenCalled();
			expect(mockSession.endSession).toHaveBeenCalled();
		});

		it("should throw error if event does not exist", async () => {
			(Event.findOne as jest.Mock).mockReturnValue({
				session: jest.fn().mockResolvedValue(null),
			});

			await expect(BookingsController.addBooking(req)).rejects.toEqual({
				status: 404,
				message: "Event does not exist",
			});
			expect(mockSession.abortTransaction).toHaveBeenCalled();
			expect(mockSession.endSession).toHaveBeenCalled();
		});

		it("should throw error if user already booked the event", async () => {
			const event = { _id: "event1", price: 100, totalSeats: 10 };
			const existingBooking = { status: true };
			(Event.findOne as jest.Mock).mockReturnValue({
				session: jest.fn().mockResolvedValue(event),
			});
			(Booking.findOne as jest.Mock).mockReturnValue({
				session: jest.fn().mockResolvedValue(existingBooking),
			});

			await expect(BookingsController.addBooking(req)).rejects.toEqual({
				status: 400,
				message: "User has already booked the event",
			});
			expect(mockSession.abortTransaction).toHaveBeenCalled();
			expect(mockSession.endSession).toHaveBeenCalled();
		});

		it("should throw error if no seats available", async () => {
			const event = { _id: "event1", price: 100, totalSeats: 2 };
			(Event.findOne as jest.Mock).mockReturnValue({
				session: jest.fn().mockResolvedValue(event),
			});
			(Booking.findOne as jest.Mock).mockReturnValue({
				session: jest.fn().mockResolvedValue(null),
			});
			(Booking.countDocuments as jest.Mock).mockResolvedValue(2);

			await expect(BookingsController.addBooking(req)).rejects.toEqual({
				status: 400,
				message: "No seats available for booking",
			});
			expect(mockSession.abortTransaction).toHaveBeenCalled();
			expect(mockSession.endSession).toHaveBeenCalled();
		});

		it("should recreate a cancelled booking", async () => {
			const event = { _id: "event1", price: 100, totalSeats: 10 };
			const existingBooking = {
				status: false,
				save: jest.fn().mockResolvedValue(true),
			};
			(Event.findOne as jest.Mock).mockReturnValue({
				session: jest.fn().mockResolvedValue(event),
			});
			(Booking.findOne as jest.Mock).mockReturnValue({
				session: jest.fn().mockResolvedValue(existingBooking),
			});
			(Booking.countDocuments as jest.Mock).mockResolvedValue(2);

			const result = await BookingsController.addBooking(req);

			expect(existingBooking.save).toHaveBeenCalled();
			expect(result).toEqual({
				booking: existingBooking,
				message: "Booking Recreated Successfully",
			});
			expect(mockSession.commitTransaction).toHaveBeenCalled();
			expect(mockSession.endSession).toHaveBeenCalled();
		});
	});

	describe("cancelBooking", () => {
		it("should cancel a booking successfully", async () => {
			const req = { params: { bookingId: "booking1" } } as any;
			const booking = { status: true, save: jest.fn().mockResolvedValue(true) };
			const findOneMock = jest
				.spyOn(BookingsController, "findOne")
				.mockResolvedValue(booking);

			const result = await BookingsController.cancelBooking(req);

			expect(findOneMock).toHaveBeenCalledWith(
				{ _id: "booking1", status: true },
				mockSession
			);
			expect(booking.save).toHaveBeenCalled();
			expect(result).toEqual({
				booking,
				message: "Booking Cancelled Successfully",
			});
			expect(mockSession.commitTransaction).toHaveBeenCalled();
			expect(mockSession.endSession).toHaveBeenCalled();
		});
	});

	describe("deleteBooking", () => {
		it("should delete a booking successfully", async () => {
			const req = { params: { bookingId: "booking1" } } as any;
			const findOneAndDeleteMock = jest
				.spyOn(BookingsController, "findOneAndDelete")
				.mockResolvedValue({});

			const result = await BookingsController.deleteBooking(req);

			expect(findOneAndDeleteMock).toHaveBeenCalledWith(
				{ _id: "booking1" },
				mockSession
			);
			expect(result).toEqual({
				message: "Booking Deleted Successfully",
			});
			expect(mockSession.commitTransaction).toHaveBeenCalled();
			expect(mockSession.endSession).toHaveBeenCalled();
		});
	});
});
