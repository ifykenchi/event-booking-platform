import { Response } from "express";

export interface IServiceResp {
	res: Response;
	status: number;
	actionType: string;
	data?: any;
	error?: any;
}
