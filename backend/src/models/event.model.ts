import mongoose, { Schema, Model } from "mongoose";
import type { IEvent } from "../interfaces/models.interfaces";

const eventSchema: Schema = new Schema({
	title: { type: String, required: true },
	about: { type: String, required: true },
	category: { type: String, required: true },
	availableSeats: { type: Number, min: 0, required: true },
	bookedSeats: { type: Number, min: 0, default: 0 },
	createdOn: { type: Date, default: new Date().getTime() },
});

export interface IEventModel extends Model<IEvent> {}

const Event: IEventModel = mongoose.model<IEvent, IEventModel>(
	"Event",
	eventSchema
);

export default Event;
