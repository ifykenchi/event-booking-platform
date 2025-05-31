import { Router } from "express";
import Joi from "../middlewares/validator.midware";
import SchemaValidator from "../validations/register.validator";
import AuthMidware from "../middlewares/auth.midware";
import UserService from "../services/users.service";

class UserRoute {
	public loadRoutes(prefix: string, router: Router) {
		this.test(prefix, router);
		this.register(prefix, router);
		this.login(prefix, router);
		this.getAllEvents(prefix, router);
		this.searchEvents(prefix, router);
	}
	private test(prefix: string, router: Router) {
		router.get(`${prefix}`, (_req, res) => {
			res.send("<h1>Server is running...</h1>");
		});
	}
	private register(prefix: string, router: Router) {
		router.post(
			`${prefix}/register`,
			Joi.vdtor(SchemaValidator.register),
			UserService.register
		);
	}
	private login(prefix: string, router: Router) {
		router.post(
			`${prefix}/login`,
			Joi.vdtor(SchemaValidator.login),
			UserService.login
		);
	}
	private getAllEvents(prefix: string, router: Router) {
		router.get(
			`${prefix}/events`,
			AuthMidware.authUser,
			UserService.getAllEvents
		);
	}
	private searchEvents(prefix: string, router: Router) {
		router.get(
			`${prefix}/search`,
			AuthMidware.authUser,
			UserService.searchEvents
		);
	}
}

export default new UserRoute();
