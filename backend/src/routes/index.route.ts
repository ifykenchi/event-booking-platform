import * as express from "express";
import chalk = require("chalk");
import env from "../env";
import usersRoute from "./users.route";
import adminRoute from "./admin.route";

export const routes = (app: express.Application) => {
	let router: express.Router;
	router = express.Router();

	console.log(chalk.yellow.bgBlack.bold("Loading user routes"));
	usersRoute.loadRoutes("/api", router);

	console.log(chalk.yellow.bgBlack.bold("Loading admin routes"));
	adminRoute.loadRoutes("/api/admin", router);

	router.get("/", (req, res) => {
		res.send(`Welcome to the Event Booking App - ${env.NODE_ENV}`);
	});

	app.use(router);

	app.use((req, res) => {
		console.log(req.url);
		res.status(404).json({ status: 404, error: "not found" });
	});
};
