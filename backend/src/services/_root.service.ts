import { IServiceResp } from "../interfaces/services.interfaces";

export class RootService {
	sendResponse = (serviceResponse: IServiceResp): any => {
		let { res, status, data, actionType, error } = serviceResponse;
		try {
			if (error) {
				throw error;
			}
			const response: any = { ...data, actionType };
			res.status(status).json(response);
		} catch (error: any) {
			res.status(status).json({ error: error.message, actionType });
		}
	};
}
