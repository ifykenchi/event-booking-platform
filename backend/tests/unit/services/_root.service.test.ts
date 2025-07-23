import { Response } from "express";
import { RootService } from "../../../src/services/_root.service";
import { IServiceResp } from "../../../src/interfaces/services.interfaces";

const mockResponse = () => {
	const res = {} as Response;
	res.status = jest.fn().mockReturnThis();
	res.json = jest.fn().mockReturnThis();
	return res;
};

describe("RootService", () => {
	let rootService: RootService;
	let res: Response;

	beforeEach(() => {
		rootService = new RootService();
		res = mockResponse();
		jest.clearAllMocks();
	});

	describe("sendResponse", () => {
		it("should send successful response with data when no error", () => {
			const serviceResponse: IServiceResp = {
				res,
				status: 200,
				data: { message: "Success" },
			};

			rootService.sendResponse(serviceResponse);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ message: "Success" });
		});

		it("should handle error response when error is provided", () => {
			const error = new Error("Test error");
			const serviceResponse: IServiceResp = {
				res,
				status: 400,
				error,
			};

			rootService.sendResponse(serviceResponse);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: "Test error" });
		});

		it("should prioritize error handling when both data and error are provided", () => {
			const error = new Error("Test error");
			const serviceResponse: IServiceResp = {
				res,
				status: 500,
				data: { message: "Should not be sent" },
				error,
			};

			rootService.sendResponse(serviceResponse);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ error: "Test error" });
			expect(res.json).not.toHaveBeenCalledWith({
				message: "Should not be sent",
			});
		});

		it("should handle empty data object when no error", () => {
			const serviceResponse: IServiceResp = {
				res,
				status: 204,
				data: {},
			};

			rootService.sendResponse(serviceResponse);

			expect(res.status).toHaveBeenCalledWith(204);
			expect(res.json).toHaveBeenCalledWith({});
		});

		it("should handle different status codes", () => {
			const testCases = [
				{ status: 200, description: "OK" },
				{ status: 201, description: "Created" },
				{ status: 400, description: "Bad Request" },
				{ status: 404, description: "Not Found" },
				{ status: 500, description: "Internal Server Error" },
			];

			testCases.forEach((testCase) => {
				const serviceResponse: IServiceResp = {
					res,
					status: testCase.status,
					data: { status: testCase.description },
				};

				rootService.sendResponse(serviceResponse);

				expect(res.status).toHaveBeenCalledWith(testCase.status);
				expect(res.json).toHaveBeenCalledWith({ status: testCase.description });

				jest.clearAllMocks();
			});
		});
	});
});
