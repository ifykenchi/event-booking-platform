import { Request, Response } from "express";
import AdminService from "../../../src/services/admin.service";
import AdminAuthController from "../../../src/controllers/adminauth.control";
import EventsController from "../../../src/controllers/events.control";
import BookingsController from "../../../src/controllers/bookings.control";
import DashboardController from "../../../src/controllers/dashboard.control";

jest.mock("../../../src/controllers/adminauth.control");
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

describe("AdminService", () => {
	let adminService: typeof AdminService;
	let mockReq: Partial<Request>;
	let mockRes: Partial<Response>;

	beforeEach(() => {
		adminService = AdminService;
		mockReq = {};
		mockRes = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};
		jest.clearAllMocks();
	});

	describe("getAdmin", () => {
		it("should handle errors when AdminAuthController.getAdmin fails", async () => {
			const error = new Error("Database error");
			(AdminAuthController.getAdmin as jest.Mock).mockRejectedValue(error);

			await adminService.getAdmin(mockReq as Request, mockRes as Response);

			expect(adminService.sendResponse).toHaveBeenCalledWith({
				res: mockRes,
				error,
			});
		});
	});

	describe("addEvent", () => {
		it("should handle errors when EventsController.addEvent fails", async () => {
			const error = new Error("Validation error") as any;
			error.status = 400;
			(EventsController.addEvent as jest.Mock).mockRejectedValue(error);

			await adminService.addEvent(mockReq as Request, mockRes as Response);

			expect(adminService.sendResponse).toHaveBeenCalledWith({
				res: mockRes,
				status: 400,
				error,
			});
		});
	});

	describe("getAllEvents", () => {
		it("should handle errors when EventsController.getAllEvents fails", async () => {
			const error = new Error("Database connection error");
			(EventsController.getAllEvents as jest.Mock).mockRejectedValue(error);

			await adminService.getAllEvents(mockReq as Request, mockRes as Response);

			expect(adminService.sendResponse).toHaveBeenCalledWith({
				res: mockRes,
				error,
			});
		});
	});

	describe("getAllBookings", () => {
		it("should handle errors when BookingsController.getAllBookings fails", async () => {
			const error = new Error("Permission denied") as any;
			error.status = 403;
			(BookingsController.getAllBookings as jest.Mock).mockRejectedValue(error);

			await adminService.getAllBookings(
				mockReq as Request,
				mockRes as Response
			);

			expect(adminService.sendResponse).toHaveBeenCalledWith({
				res: mockRes,
				status: 403,
				error,
			});
		});
	});

	describe("totalEvents", () => {
		it("should handle errors when DashboardController.totalEvents fails", async () => {
			const error = new Error("Aggregation error");
			(DashboardController.totalEvents as jest.Mock).mockRejectedValue(error);

			await adminService.totalEvents(mockReq as Request, mockRes as Response);

			expect(adminService.sendResponse).toHaveBeenCalledWith({
				res: mockRes,
				error,
			});
		});
	});

	describe("totalBookings", () => {
		it("should handle errors when DashboardController.totalBookings fails", async () => {
			const error = new Error("Count error");
			(DashboardController.totalBookings as jest.Mock).mockRejectedValue(error);

			await adminService.totalBookings(mockReq as Request, mockRes as Response);

			expect(adminService.sendResponse).toHaveBeenCalledWith({
				res: mockRes,
				error,
			});
		});
	});

	describe("mostBookedEvents", () => {
		it("should handle errors when DashboardController.mostBookedEvents fails", async () => {
			const error = new Error("Pipeline error");
			(DashboardController.mostBookedEvents as jest.Mock).mockRejectedValue(
				error
			);

			await adminService.mostBookedEvents(
				mockReq as Request,
				mockRes as Response
			);

			expect(adminService.sendResponse).toHaveBeenCalledWith({
				res: mockRes,
				error,
			});
		});
	});

	describe("totalRevenue", () => {
		it("should handle errors when DashboardController.totalRevenue fails", async () => {
			const error = new Error("Calculation error");
			(DashboardController.totalRevenue as jest.Mock).mockRejectedValue(error);

			await adminService.totalRevenue(mockReq as Request, mockRes as Response);

			expect(adminService.sendResponse).toHaveBeenCalledWith({
				res: mockRes,
				error,
			});
		});
	});
});
