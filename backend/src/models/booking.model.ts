import mongoose, { Schema, Model, SchemaType } from "mongoose";
import type { IBooking } from "../interfaces/models.interfaces";

const bookingSchema: Schema = new Schema({
	eventId: {
		type: Schema.Types.ObjectId,
		ref: "Event",
		required: true,
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	userDetails: { type: Object, required: true },
	createdOn: { type: Date, default: new Date().getTime() },
});

export interface IBookingModel extends Model<IBooking> {}

const Booking: IBookingModel = mongoose.model<IBooking, IBookingModel>(
	"Booking",
	bookingSchema
);

export default Booking;
