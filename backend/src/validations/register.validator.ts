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
		category: joi.string().min(3).max(300).required(),
		createdOn: joi.date(),
	});

	public editEvent = joi.object({
		title: joi.string().min(3).max(50),
		about: joi.string().min(6).max(3000),
		category: joi.string().min(3).max(3000),
	});
}

export default new SchemaValidator();
