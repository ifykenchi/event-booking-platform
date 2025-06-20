import { Router } from "express";
import Joi from "../middlewares/validator.midware";
import SchemaValidator from "../validations/register.validator";
import BookingSchemaValidator from "../validations/booking.validator";
import AuthMidware from "../middlewares/auth.midware";
import UserService from "../services/users.service";

class UserRoute {
	public loadRoutes(prefix: string, router: Router) {
		this.user(prefix, router);
		this.register(prefix, router);
		this.login(prefix, router);
		this.getAllEvents(prefix, router);
		this.searchEvents(prefix, router);
		this.addBooking(prefix, router);
		this.getUserBookings(prefix, router);
		this.deleteBooking(prefix, router);
	}
	private user(prefix: string, router: Router) {
		router.get(`${prefix}`, AuthMidware.authUser, UserService.getUser);
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
	private addBooking(prefix: string, router: Router) {
		router.post(
			`${prefix}/booking`,
			AuthMidware.authUser,
			Joi.vdtor(BookingSchemaValidator.createBooking),
			UserService.addBooking
		);
	}
	private getUserBookings(prefix: string, router: Router) {
		router.get(
			`${prefix}/bookings/:userId`,
			AuthMidware.authUser,
			UserService.getUserBookings
		);
	}
	private deleteBooking(prefix: string, router: Router) {
		router.delete(
			`${prefix}/booking/:bookingId`,
			AuthMidware.authUser,
			UserService.deleteBooking
		);
	}
}

export default new UserRoute();
