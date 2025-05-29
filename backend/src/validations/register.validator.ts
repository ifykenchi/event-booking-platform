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
		userId: joi.string().required(),
		createdOn: joi.date(),
	});
	// .length(24) // Must be exactly 24 chars
	// .hex() // Must be a hexadecimal string (0-9, a-f)
}

export default new SchemaValidator();
