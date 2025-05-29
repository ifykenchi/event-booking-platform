import mongoose, { Schema, Model } from "mongoose";
import type { IEvent } from "../interfaces/models.interfaces";

const eventSchema: Schema = new Schema({
	title: { type: String },
	about: { type: String },
	userId: { type: String },
	createdOn: { type: Date, default: new Date().getTime() },
});

export interface IEventModel extends Model<IEvent> {}

const Event: IEventModel = mongoose.model<IEvent, IEventModel>(
	"Event",
	eventSchema
);

export default Event;
