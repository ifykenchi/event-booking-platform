import mongoose, { Schema, Model } from "mongoose";
import type { IAdmin } from "../interfaces/models.interfaces";

const adminSchema: Schema = new Schema({
	username: { type: String },
	email: { type: String },
	password: { type: String },
});

export interface IAdminModel extends Model<IAdmin> {}

const Admin: IAdminModel = mongoose.model<IAdmin, IAdminModel>(
	"Admin",
	adminSchema
);

export default Admin;
