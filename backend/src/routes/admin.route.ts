import { Router } from "express";
import Joi from "../middlewares/validator.midware";
import SchemaValidator from "../validations/register.validator";
import AuthMidware from "../middlewares/auth.midware";
import AdminService from "../services/admin.service";

class AdminRoute {
	public loadRoutes(prefix: string, router: Router) {
		this.test(prefix, router);
		this.register(prefix, router);
		this.login(prefix, router);
		this.addEvent(prefix, router);
		this.getAllEvents(prefix, router);
		this.getEvent(prefix, router);
		this.editEvent(prefix, router);
		this.deleteEvent(prefix, router);
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
			AdminService.register
		);
	}
	private login(prefix: string, router: Router) {
		router.post(
			`${prefix}/login`,
			Joi.vdtor(SchemaValidator.login),
			AdminService.login
		);
	}
	private addEvent(prefix: string, router: Router) {
		router.post(
			`${prefix}/event`,
			AuthMidware.authAdmin,
			Joi.vdtor(SchemaValidator.validEvent),
			AdminService.addEvent
		);
	}
	private getAllEvents(prefix: string, router: Router) {
		router.get(
			`${prefix}/events`,
			AuthMidware.authAdmin,
			AdminService.getAllEvents
		);
	}
	private getEvent(prefix: string, router: Router) {
		router.get(
			`${prefix}/event/:eventId`,
			AuthMidware.authAdmin,
			AdminService.getEvent
		);
	}
	private editEvent(prefix: string, router: Router) {
		router.patch(
			`${prefix}/event/:eventId`,
			AuthMidware.authAdmin,
			Joi.vdtor(SchemaValidator.editEvent),
			AdminService.editEvent
		);
	}
	private deleteEvent(prefix: string, router: Router) {
		router.delete(
			`${prefix}/delete/:eventId`,
			AuthMidware.authAdmin,
			AdminService.deleteEvent
		);
	}
}

export default new AdminRoute();
