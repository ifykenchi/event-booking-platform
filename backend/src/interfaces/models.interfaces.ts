import { Document, Types } from "mongoose";

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
	totalSeats: number;
	category: string;
	createdOn: Date;
}

interface IUserDetails {
	fullName: string;
	email: string;
	phoneNumber: string;
}

export interface IBooking extends Document {
	eventId: Types.ObjectId;
	userId: Types.ObjectId;
	userDetails: IUserDetails;
	createdOn: Date;
}
