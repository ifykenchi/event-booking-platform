import DashboardController from "../../../src/controllers/dashboard.control";
import Event from "../../../src/models/event.model";
import Booking from "../../../src/models/booking.model";

jest.mock("../../../src/models/event.model");
jest.mock("../../../src/models/booking.model");

describe("DashboardController", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("totalEvents", () => {
		it("should return total number of events", async () => {
			(Event.countDocuments as jest.Mock).mockResolvedValue(5);

			const result = await DashboardController.totalEvents();

			expect(Event.countDocuments).toHaveBeenCalledWith({});
			expect(result).toEqual({
				totalEvents: 5,
				message: "total events sent successfully",
			});
		});

		it("should throw error if countDocuments fails", async () => {
			(Event.countDocuments as jest.Mock).mockRejectedValue(
				new Error("DB error")
			);

			await expect(DashboardController.totalEvents()).rejects.toThrow(
				"DB error"
			);
		});
	});

	describe("totalBookings", () => {
		it("should return total number of bookings with status true", async () => {
			(Booking.countDocuments as jest.Mock).mockResolvedValue(10);

			const result = await DashboardController.totalBookings();

			expect(Booking.countDocuments).toHaveBeenCalledWith({ status: true });
			expect(result).toEqual({
				totalBookings: 10,
				message: "total bookings sent successfully",
			});
		});

		it("should throw error if countDocuments fails", async () => {
			(Booking.countDocuments as jest.Mock).mockRejectedValue(
				new Error("DB error")
			);

			await expect(DashboardController.totalBookings()).rejects.toThrow(
				"DB error"
			);
		});
	});

	describe("mostBookedEvents", () => {
		it("should return most booked events when aggregation returns results", async () => {
			const aggResult = [
				{
					eventId: "event1",
					title: "Event 1",
					bookingCount: 20,
					totalSeats: 100,
				},
			];
			(Booking.aggregate as jest.Mock).mockResolvedValue(aggResult);

			const result = await DashboardController.mostBookedEvents();

			expect(Booking.aggregate).toHaveBeenCalled();
			expect(result).toEqual({
				mostBookedEvents: aggResult,
				message: "most-booked-events sent successfully",
			});
		});

		it("should return null if aggregation returns empty array", async () => {
			(Booking.aggregate as jest.Mock).mockResolvedValue([]);

			const result = await DashboardController.mostBookedEvents();

			expect(result).toEqual({
				mostBookedEvents: null,
				message: "most-booked-events sent successfully",
			});
		});

		it("should throw error if aggregate fails", async () => {
			(Booking.aggregate as jest.Mock).mockRejectedValue(
				new Error("Aggregation error")
			);

			await expect(DashboardController.mostBookedEvents()).rejects.toThrow(
				"Aggregation error"
			);
		});
	});

	describe("totalRevenue", () => {
		it("should return total revenue when aggregation returns a value", async () => {
			(Booking.aggregate as jest.Mock).mockResolvedValue([
				{ totalRevenue: 500 },
			]);

			const result = await DashboardController.totalRevenue();

			expect(Booking.aggregate).toHaveBeenCalled();
			expect(result).toEqual({
				totalRevenue: 500,
				message: "Total revenue fetched successfully",
			});
		});

		it("should return 0 revenue when aggregation returns empty array", async () => {
			(Booking.aggregate as jest.Mock).mockResolvedValue([]);

			const result = await DashboardController.totalRevenue();

			expect(result).toEqual({
				totalRevenue: 0,
				message: "Total revenue fetched successfully",
			});
		});

		it("should throw error if aggregate fails", async () => {
			(Booking.aggregate as jest.Mock).mockRejectedValue(
				new Error("Aggregation error")
			);

			await expect(DashboardController.totalRevenue()).rejects.toThrow(
				"Aggregation error"
			);
		});
	});
});
