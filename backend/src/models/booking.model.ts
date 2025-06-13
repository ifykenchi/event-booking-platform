import mongoose, { Schema, Model } from "mongoose";
import type { IBooking } from "../interfaces/models.interfaces";
import { required } from "joi";

const bookingSchema: Schema = new Schema({
	event: {
		type: new Schema({
			title: {
				type: String,
				required: true,
			},
			availableSeats: {
				type: Number,
				min: 1,
				required: true,
			},
			bookedSeats: {
				type: Number,
				min: 0,
				default: 0,
				required: true,
			},
			category: {
				type: String,
				min: 3,
				max: 50,
				required: true,
			},
		}),
		required: true,
	},
	user: {
		type: new Schema({
			username: {
				type: String,
				min: 3,
				max: 30,
				required: true,
			},
			email: {
				type: String,
				required: true,
			},
		}),
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
