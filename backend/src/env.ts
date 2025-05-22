import dotenv from "dotenv";
dotenv.config();

const env = {
	MONGODB_URI: process.env.MONGODB_URI,
	ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
	ADMIN_TOKEN_SECRET: process.env.ADMIN_TOKEN_SECRET as string,
	NODE_ENV: process.env.NODE_ENV,
};

export default env;
