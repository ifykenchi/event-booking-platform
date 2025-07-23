import { Request, Response } from "express";
import UserService from "../../../src/services/users.service";
import UserAuthController from "../../../src/controllers/userauth.control";
import EventsController from "../../../src/controllers/events.control";
import BookingsController from "../../../src/controllers/bookings.control";
import DashboardController from "../../../src/controllers/dashboard.control";

jest.mock("../../../src/controllers/userauth.control");
jest.mock("../../../src/controllers/events.control");
jest.mock("../../../src/controllers/bookings.control");
jest.mock("../../../src/controllers/dashboard.control");

jest.mock("../../../src/services/_root.service", () => {
	return {
		RootService: jest.fn().mockImplementation(() => ({
			sendResponse: jest.fn(),
		})),
	};
});

describe("UserService", () => {
	let userService: typeof UserService;
	let mockReq: Partial<Request>;
	let mockRes: Partial<Response>;

	beforeEach(() => {
		userService = UserService;
		mockReq = {};
		mockRes = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};
		jest.clearAllMocks();
	});

	describe("getUser", () => {
		it("should handle errors when UserAuthController.getUser fails", async () => {
			const error = new Error("Database error");
			(UserAuthController.getUser as jest.Mock).mockRejectedValue(error);

			await userService.getUser(mockReq as Request, mockRes as Response);

			expect(userService.sendResponse).toHaveBeenCalledWith({
				res: mockRes,
				status: 500,
				error,
			});
		});
	});

	describe("getAllEvents", () => {
		it("should handle errors when EventsController.getAllEvents fails", async () => {
			const error = new Error("Database connection error");
			(EventsController.getAllEvents as jest.Mock).mockRejectedValue(error);

			await userService.getAllEvents(mockReq as Request, mockRes as Response);

			expect(userService.sendResponse).toHaveBeenCalledWith({
				res: mockRes,
				status: 500,
				error,
			});
		});
	});

	describe("getUserBookings", () => {
		it("should handle errors when BookingsController.getUserBookings fails", async () => {
			const error = new Error("Database connection error") as any;
			(BookingsController.getUserBookings as jest.Mock).mockRejectedValue(
				error
			);

			await userService.getUserBookings(
				mockReq as Request,
				mockRes as Response
			);

			expect(userService.sendResponse).toHaveBeenCalledWith({
				res: mockRes,
				status: 500,
				error,
			});
		});
	});
});
