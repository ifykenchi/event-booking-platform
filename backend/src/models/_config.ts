import mongoose = require("mongoose");
import env from "../env";
import chalk = require("chalk");

mongoose.set("strictQuery", false);

export const dbConfig = () => {
	if (env.MONGODB_URI) {
		mongoose
			.connect(env.MONGODB_URI)
			.then(() => {
				console.log(
					chalk.green.bgBlack.bold("✌️ Successfully connected to MongoDB")
				);
			})
			.catch((err) => {
				console.log(err);
				console.log(
					chalk.red.bgBlack.bold(
						"An error occurred while connecting to MongoDB"
					)
				);
			});
	} else {
		console.log("MONGODB_URI environment varaiable is required.");
	}
};
