import { IUser, IAdmin } from "./models.interfaces";
import { Request } from "express";

export interface CustomRequest extends Request {
	user?: {
		user: IUser;
		admin: IAdmin;
	};
}
