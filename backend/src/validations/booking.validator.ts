import * as joi from "joi";

class BookingSchemaValidator {
	public createBooking = joi.object({
		eventId: joi.string().hex().length(24).required().messages({
			"string.hex": "Event ID must be valid hexadecimal",
			"string.length": "Event ID must be 24 characters long",
		}),
		userId: joi.string().hex().length(24).required().messages({
			"string.hex": "User ID must be valid hexadecimal",
			"string.length": "User ID must be 24 characters long",
		}),
		userDetails: joi.object({
			fullName: joi.string().min(3).max(100).required(),
			email: joi.string().email().required(),
			phoneNumber: joi
				.string()
				.pattern(/^\+?[0-9\s\-\(\)]{6,20}$/)
				.required(),
		}),
		createdOn: joi.date(),
	});
}

export default new BookingSchemaValidator();
