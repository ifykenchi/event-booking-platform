import * as joi from "joi";

class BookingSchemaValidator {
	public createBooking = joi.object({
		eventId: joi.string().min(3).max(50).required(),
		userId: joi.string().min(3).max(50).required(),
		userDetails: joi.object().required(),
		createdOn: joi.date().default(new Date()),
	});
}
