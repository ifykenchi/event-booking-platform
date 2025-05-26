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
}

export default new SchemaValidator();
