import { Model, Document, ClientSession } from "mongoose";
import { RootController } from "../../../src/controllers/_root.control";

const mockModel = {
	findOne: jest.fn(),
	findOneAndDelete: jest.fn(),
} as unknown as Model<any>;

const mockDocument = {
	_id: "507f191e810c19729de860ea",
	name: "Test Document",
} as unknown as Document;

const mockSession = {
	startTransaction: jest.fn(),
	commitTransaction: jest.fn(),
	abortTransaction: jest.fn(),
	endSession: jest.fn(),
} as unknown as ClientSession;

describe("RootController", () => {
	let rootController: RootController;

	beforeEach(() => {
		rootController = new RootController(mockModel, "TestModel");
		jest.clearAllMocks();
	});

	describe("findOne", () => {
		it("should return a document when found", async () => {
			(mockModel.findOne as jest.Mock).mockReturnValue({
				session: jest.fn().mockReturnThis(),
				exec: jest.fn().mockResolvedValue(mockDocument),
			});

			const result = await rootController.findOne({
				_id: "507f191e810c19729de860ea",
			});
			expect(result).toEqual(mockDocument);
			expect(mockModel.findOne).toHaveBeenCalledWith({
				_id: "507f191e810c19729de860ea",
			});
		});

		it("should use session when provided", async () => {
			const sessionQuery = {
				session: jest.fn().mockReturnThis(),
				exec: jest.fn().mockResolvedValue(mockDocument),
			};
			(mockModel.findOne as jest.Mock).mockReturnValue(sessionQuery);

			await rootController.findOne(
				{ _id: "507f191e810c19729de860ea" },
				mockSession
			);
			expect(sessionQuery.session).toHaveBeenCalledWith(mockSession);
		});

		it("should throw 404 error when document not found", async () => {
			(mockModel.findOne as jest.Mock).mockReturnValue({
				session: jest.fn().mockReturnThis(),
				exec: jest.fn().mockResolvedValue(null),
			});

			await expect(
				rootController.findOne({ _id: "invalid-id" })
			).rejects.toEqual({
				status: 404,
				message: "TestModel does not exist",
			});
		});

		it("should propagate Mongoose errors", async () => {
			const mockError = new Error("Database error");
			(mockModel.findOne as jest.Mock).mockReturnValue({
				session: jest.fn().mockReturnThis(),
				exec: jest.fn().mockRejectedValue(mockError),
			});

			await expect(
				rootController.findOne({ _id: "507f191e810c19729de860ea" })
			).rejects.toThrow("Database error");
		});
	});

	describe("findOneAndDelete", () => {
		it("should delete and return a document when found", async () => {
			(mockModel.findOneAndDelete as jest.Mock).mockReturnValue({
				session: jest.fn().mockReturnThis(),
				exec: jest.fn().mockResolvedValue(mockDocument),
			});

			const result = await rootController.findOneAndDelete({
				_id: "507f191e810c19729de860ea",
			});
			expect(result).toEqual(mockDocument);
			expect(mockModel.findOneAndDelete).toHaveBeenCalledWith({
				_id: "507f191e810c19729de860ea",
			});
		});

		it("should use session when provided for delete", async () => {
			const sessionQuery = {
				session: jest.fn().mockReturnThis(),
				exec: jest.fn().mockResolvedValue(mockDocument),
			};
			(mockModel.findOneAndDelete as jest.Mock).mockReturnValue(sessionQuery);

			await rootController.findOneAndDelete(
				{ _id: "507f191e810c19729de860ea" },
				mockSession
			);
			expect(sessionQuery.session).toHaveBeenCalledWith(mockSession);
		});

		it("should throw 404 error when document to delete not found", async () => {
			(mockModel.findOneAndDelete as jest.Mock).mockReturnValue({
				session: jest.fn().mockReturnThis(),
				exec: jest.fn().mockResolvedValue(null),
			});

			await expect(
				rootController.findOneAndDelete({ _id: "invalid-id" })
			).rejects.toEqual({
				status: 404,
				message: "TestModel does not exist",
			});
		});

		it("should propagate Mongoose errors during delete", async () => {
			const mockError = new Error("Database error");
			(mockModel.findOneAndDelete as jest.Mock).mockReturnValue({
				session: jest.fn().mockReturnThis(),
				exec: jest.fn().mockRejectedValue(mockError),
			});

			await expect(
				rootController.findOneAndDelete({ _id: "507f191e810c19729de860ea" })
			).rejects.toThrow("Database error");
		});
	});
});
