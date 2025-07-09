import { Model, Document } from "mongoose";
import { ClientSession } from "mongoose";

export class RootController {
	private model: Model<any>;
	private modelName: string;
	constructor(model: Model<any>, modelName: string = "Document") {
		this.model = model;
		this.modelName = modelName;
	}

	findOne = async (condition: object, session?: ClientSession) => {
		try {
			const query = this.model.findOne(condition);
			if (session) query.session(session);

			const document = await query.exec();
			if (!document) {
				const response = {
					status: 404,
					message: `${this.modelName} does not exist`,
				};
				throw response;
			}
			return document;
		} catch (error) {
			throw error;
		}
	};

	findOneAndDelete = async (condition: object, session?: ClientSession) => {
		try {
			const query = this.model.findOneAndDelete(condition);
			if (session) query.session(session);

			const document = await query.exec();
			if (!document) {
				const response = {
					status: 404,
					message: `${this.modelName} does not exist`,
				};
				throw response;
			}
			return document;
		} catch (error) {
			throw error;
		}
	};
}
