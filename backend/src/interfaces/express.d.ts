import { IUser, IAdmin } from "./models.interfaces";
import { Request } from "express";

// declare global {
// 	namespace Express {
// 		interface Request {
// 			user?: {
// 				user: IUser;
// 				admin: IAdmin;
// 			};
// 		}
// 	}
// }

export interface CustomRequest extends Request {
	user?: {
		user: IUser;
		admin: IAdmin;
	};
}
