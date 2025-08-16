import { Router } from "express";
import Joi from "../middlewares/validator.midware";
import SchemaValidator from "../validations/register.validator";
import BookingSchemaValidator from "../validations/booking.validator";
import AuthMidware from "../middlewares/auth.midware";
import AdminService from "../services/admin.service";

class AdminRoute {
	public loadRoutes(prefix: string, router: Router) {
		this.admin(prefix, router);
		this.register(prefix, router);
		this.login(prefix, router);
		this.deleteAdmin(prefix, router);
		this.addEvent(prefix, router);
		this.getAllEvents(prefix, router);
		this.getEvent(prefix, router);
		this.editEvent(prefix, router);
		this.searchEvents(prefix, router);
		this.deleteEvent(prefix, router);
		this.getAllBookings(prefix, router);
		this.deleteBooking(prefix, router);
		this.totalEvents(prefix, router);
		this.totalBookings(prefix, router);
		this.mostBookedEvents(prefix, router);
		this.totalRevenue(prefix, router);
	}
	private admin(prefix: string, router: Router) {
		router.get(`${prefix}`, AuthMidware.authAdmin, AdminService.getAdmin);
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
	private deleteAdmin(prefix: string, router: Router) {
		router.delete(
			`${prefix}/admin-delete`,
			AuthMidware.authAdmin,
			AdminService.deleteAdmin
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
	private searchEvents(prefix: string, router: Router) {
		router.get(
			`${prefix}/search`,
			AuthMidware.authAdmin,
			AdminService.searchEvents
		);
	}
	private deleteEvent(prefix: string, router: Router) {
		router.delete(
			`${prefix}/delete/:eventId`,
			AuthMidware.authAdmin,
			AdminService.deleteEvent
		);
	}
	private getAllBookings(prefix: string, router: Router) {
		router.get(
			`${prefix}/bookings`,
			AuthMidware.authAdmin,
			AdminService.getAllBookings
		);
	}
	private deleteBooking(prefix: string, router: Router) {
		router.delete(
			`${prefix}/booking/:bookingId`,
			AuthMidware.authAdmin,
			AdminService.deleteBooking
		);
	}
	private totalEvents(prefix: string, router: Router) {
		router.get(
			`${prefix}/dashboard/events`,
			AuthMidware.authAdmin,
			AdminService.totalEvents
		);
	}
	private totalBookings(prefix: string, router: Router) {
		router.get(
			`${prefix}/dashboard/bookings`,
			AuthMidware.authAdmin,
			AdminService.totalBookings
		);
	}
	private mostBookedEvents(prefix: string, router: Router) {
		router.get(
			`${prefix}/dashboard/most-booked-events`,
			AuthMidware.authAdmin,
			AdminService.mostBookedEvents
		);
	}
	private totalRevenue(prefix: string, router: Router) {
		router.get(
			`${prefix}/dashboard/total-revenue`,
			AuthMidware.authAdmin,
			AdminService.totalRevenue
		);
	}
}

export default new AdminRoute();
