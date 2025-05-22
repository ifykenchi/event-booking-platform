import * as joi from "joi";
import { Request, Response, NextFunction } from "express";

export class Joi {
	vdtor(schema: joi.Schema, field: "body" | "query" = "body") {
		return async (req: Request, res: Response, next: NextFunction) => {
			try {
				await schema.validateAsync(req[field], { abortEarly: false });
				next();
			} catch (err: any) {
				const errorMessage = err.details[0].message.replace(/"/g, "");
				res.status(400).json({ error: true, message: errorMessage });
			}
		};
	}
}

const newJoi = new Joi();
export default newJoi;
