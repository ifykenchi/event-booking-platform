import { Document } from "mongoose";

export interface IUser extends Document {
	username: string;
	email: string;
	password: string;
}

export interface IAdmin extends Document {
	username: string;
	email: string;
	password: string;
}

export interface IEvent extends Document {
	title: string;
	about: string;
	availablleSeats: number;
	category: string;
	createdOn: Date;
}

export interface IBooking extends Document {
	eventId: string;
	userId: string;
	userDetails: object;
	availableSeats: number;
	bookedSeats: number;
	createdOn: Date;
}
