import { IServiceResp } from "../interfaces/services.interfaces";

export class RootService {
	sendResponse = (serviceResponse: IServiceResp): any => {
		let { res, status, data, error } = serviceResponse;
		try {
			if (error) {
				throw error;
			}
			res.status(status).json(data);
		} catch (error: any) {
			res.status(status).json({ error: error.message });
		}
	};
}
