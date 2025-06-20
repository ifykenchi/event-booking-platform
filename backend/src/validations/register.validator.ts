import { create } from "domain";
import * as joi from "joi";

class SchemaValidator {
	public register = joi.object({
		username: joi.string().min(3).max(30).required(),
		email: joi
			.string()
			.email({
				minDomainSegments: 2,
				tlds: { allow: ["com", "net"] },
			})
			.required(),
		password: joi.string().min(6).max(30).required(),
	});

	public login = joi.object({
		email: joi
			.string()
			.email({
				minDomainSegments: 2,
				tlds: { allow: ["com", "net"] },
			})
			.required(),
		password: joi.string().min(6).max(30).required(),
	});

	public validEvent = joi.object({
		title: joi.string().min(3).max(50).required(),
		about: joi.string().min(6).max(3000).required(),
		totalSeats: joi.number().integer().min(0).max(1000000).required(),
		category: joi.string().min(3).max(50).required(),
		createdOn: joi.date(),
	});

	public editEvent = joi.object({
		_id: joi.string().min(3).max(50),
		title: joi.string().min(3).max(50),
		about: joi.string().min(6).max(3000),
		totalSeats: joi.number().integer().min(0).max(1000000),
		category: joi.string().min(3).max(50),
		createdOn: joi.date(),
	});
}

export default new SchemaValidator();
