import mongoose, { Schema, Model } from "mongoose";
import type { IUser } from "../interfaces/models.interfaces";

const userSchema: Schema = new Schema({
	username: { type: String },
	email: { type: String },
	password: { type: String },
});

export interface IUserModel extends Model<IUser> {}

const User: IUserModel = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
