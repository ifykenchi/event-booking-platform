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
	userId: string;
	createdOn: Date;
}
