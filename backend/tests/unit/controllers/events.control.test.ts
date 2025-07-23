import EventsController from "../../../src/controllers/events.control";
import Event from "../../../src/models/event.model";
import Booking from "../../../src/models/booking.model";

jest.mock("../../../src/models/event.model");
jest.mock("../../../src/models/booking.model");

const mockEvent = {
	_id: "event1",
	title: "Test Event",
	about: "About",
	totalSeats: 100,
	price: 50,
	category: "Music",
	save: jest.fn().mockResolvedValue(true),
	toObject: function () {
		return { ...this };
	},
};

describe("EventsController", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(Event as any).mockImplementation(() => mockEvent);
	});

	describe("addEvent", () => {
		it("should create a new event successfully", async () => {
			const req = {
				body: {
					title: "Test Event",
					about: "About",
					totalSeats: 100,
					price: 50,
					category: "Music",
				},
			} as any;

			(mockEvent.save as jest.Mock).mockResolvedValue(mockEvent);

			const result = await EventsController.addEvent(req);

			expect(result).toEqual({
				event: mockEvent,
				message: "Event Created Successfully",
			});
			expect(mockEvent.save).toHaveBeenCalled();
		});

		it("should throw error if save fails", async () => {
			const req = { body: {} } as any;
			(mockEvent.save as jest.Mock).mockRejectedValue(new Error("Save error"));

			await expect(EventsController.addEvent(req)).rejects.toThrow(
				"Save error"
			);
		});
	});

	describe("getAllEvents", () => {
		it("should return all events with available seats", async () => {
			const events = [
				{ _id: "event1", title: "A", totalSeats: 10 },
				{ _id: "event2", title: "B", totalSeats: 20 },
			];
			const bookedSeats = [
				{ _id: "event1", count: 3 },
				{ _id: "event2", count: 5 },
			];
			(Event.find as jest.Mock).mockReturnValue({
				sort: jest.fn().mockReturnValue({
					lean: jest.fn().mockResolvedValue(events),
				}),
			});
			(Booking.aggregate as jest.Mock).mockResolvedValue(bookedSeats);

			const result = await EventsController.getAllEvents();

			expect(result).toEqual({
				events: [
					{ ...events[0], availableSeats: 7 },
					{ ...events[1], availableSeats: 15 },
				],
				message: "All Events Retrieved Successfully",
			});
		});

		it("should throw error if Event.find fails", async () => {
			(Event.find as jest.Mock).mockImplementation(() => {
				throw new Error("DB error");
			});

			await expect(EventsController.getAllEvents()).rejects.toThrow("DB error");
		});
	});

	describe("getEvent", () => {
		it("should return a single event with available seats", async () => {
			const req = { params: { eventId: "event1" } } as any;
			const event = {
				...mockEvent,
				totalSeats: 10,
				toObject: () => ({ ...mockEvent, totalSeats: 10 }),
			};
			const findOneMock = jest
				.spyOn(EventsController, "findOne")
				.mockResolvedValue(event);
			(Booking.countDocuments as jest.Mock).mockResolvedValue(4);

			const result = await EventsController.getEvent(req);

			expect(findOneMock).toHaveBeenCalledWith({ _id: "event1" });
			expect(result).toEqual({
				event: { ...event.toObject(), availableSeats: 6 },
				message: "Event Get Successful",
			});
		});
	});

	describe("editEvent", () => {
		it("should edit an event successfully", async () => {
			const req = {
				params: { eventId: "event1" },
				body: {
					title: "New Title",
					about: "New About",
					totalSeats: 200,
					category: "Art",
					price: 150,
				},
			} as any;
			const event = { ...mockEvent, save: jest.fn().mockResolvedValue(true) };
			const findOneMock = jest
				.spyOn(EventsController, "findOne")
				.mockResolvedValue(event);

			const result = await EventsController.editEvent(req);

			expect(findOneMock).toHaveBeenCalledWith({ _id: "event1" });
			expect(event.save).toHaveBeenCalled();
			expect(result).toEqual({
				event,
				message: "Event Edited Successfully",
			});
		});
	});

	describe("searchEvents", () => {
		it("should search events by key and value", async () => {
			const payload = { key: "category", value: "Music" };
			const events = [
				{ _id: "event1", title: "A", totalSeats: 10, category: "Music" },
			];
			const bookedSeats = [{ _id: "event1", count: 2 }];
			(Event.find as jest.Mock).mockReturnValue({
				select: jest.fn().mockReturnThis(),
				sort: jest.fn().mockReturnThis(),
				lean: jest.fn().mockResolvedValue(events),
			});
			(Booking.aggregate as jest.Mock).mockResolvedValue(bookedSeats);

			const result = await EventsController.searchEvents(payload);

			expect(result).toEqual([{ ...events[0], availableSeats: 8 }]);
		});

		it("should throw error if key or value is missing", async () => {
			await expect(
				EventsController.searchEvents({ key: "", value: "" })
			).rejects.toEqual({
				status: 400,
				message: "Both 'key' and 'value' query parameters are required",
			});
		});

		it("should throw error if Event.find fails", async () => {
			(Event.find as jest.Mock).mockImplementation(() => {
				throw new Error("DB error");
			});

			await expect(
				EventsController.searchEvents({ key: "category", value: "Music" })
			).rejects.toThrow("DB error");
		});

		it("should throw error when no events are found (null case)", async () => {
			const payload = { key: "category", value: "NonExistent" };

			(Event.find as jest.Mock).mockReturnValue({
				select: jest.fn().mockReturnThis(),
				sort: jest.fn().mockReturnThis(),
				lean: jest.fn().mockResolvedValue(null),
			});

			await expect(EventsController.searchEvents(payload)).rejects.toEqual({
				message: "events not found",
			});
		});
	});

	describe("deleteEvent", () => {
		it("should delete an event successfully", async () => {
			const req = { params: { eventId: "event1" } } as any;
			const findOneAndDeleteMock = jest
				.spyOn(EventsController, "findOneAndDelete")
				.mockResolvedValue({});

			const result = await EventsController.deleteEvent(req);

			expect(findOneAndDeleteMock).toHaveBeenCalledWith({ _id: "event1" });
			expect(result).toEqual({
				message: "Event Deleted Successfully",
			});
		});
	});
});
