import { Response } from "express";

export interface IServiceResp {
	res: Response;
	status: number;
	data?: any;
	error?: any;
}
