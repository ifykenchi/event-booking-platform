import request from "supertest";
import app from "../../src/app";
import mongoose from "mongoose";
import TokenUtil from "../../src/utilities/token.util";

describe("AdminRoute - register", () => {
	it("should register an admin and return 201 with output data", async () => {
		const res = await request(app).post("/admin/register").send({
			username: "collins",
			email: "admin@example.com",
			password: "password123",
		});
		expect(res.status).toBe(201);
		expect(res.body.admin).toHaveProperty("email", "admin@example.com");
		expect(res.body).toHaveProperty("adminToken");
		expect(res.body).toHaveProperty("message", "Admin Registration Successful");
	});

	it("should not allow duplicate admin registration", async () => {
		await request(app).post("/admin/register").send({
			username: "collins",
			email: "admin@example.com",
			password: "password123",
		});

		const res = await request(app).post("/admin/register").send({
			username: "collins",
			email: "admin@example.com",
			password: "password123",
		});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error");
		expect(res.body.error).toBe("Admin already exists");
	});

	it("should return 400 if required fields are missing", async () => {
		const res = await request(app).post("/admin/register").send({
			email: "admin@example.com",
		});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error");
		expect(res.body.message).toBe("username is required");
	});

	it("should return 400 for invalid email format", async () => {
		const res = await request(app).post("/admin/register").send({
			username: "collins",
			email: "invalid-email",
			password: "password123",
		});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error");
		expect(res.body.message).toBe("email must be a valid email");
	});
});

describe("AdminRoute - login", () => {
	beforeEach(async () => {
		await request(app).post("/admin/register").send({
			username: "collins",
			email: "admin2@example.com",
			password: "password123",
		});
	});

	it("should login an admin and return 200 with output data", async () => {
		const res = await request(app).post("/admin/login").send({
			email: "admin2@example.com",
			password: "password123",
		});

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("email", "admin2@example.com");
		expect(res.body).toHaveProperty("adminToken");
		expect(res.body).toHaveProperty("message", "Admin Login Successful");
	});

	it("should return 400 for invalid credentials", async () => {
		const res = await request(app).post("/admin/login").send({
			email: "admin2@example.com",
			password: "wrongpassword",
		});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error");
		expect(res.body.error).toBe("Invalid password");
	});

	it("should return 400 if required fields are missing", async () => {
		const res = await request(app).post("/admin/login").send({
			email: "admin2@example.com",
		});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error");
		expect(res.body.message).toBe("password is required");
	});

	it("should return 400 for invalid email format", async () => {
		const res = await request(app).post("/admin/login").send({
			email: "invalid-email",
			password: "password123",
		});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error");
		expect(res.body.message).toBe("email must be a valid email");
	});
});

describe("AdminRoute - getAdmin", () => {
	let adminToken: string;

	beforeAll(async () => {
		const res = await request(app).post("/admin/register").send({
			username: "collins",
			email: "admin@example.com",
			password: "password123",
		});
		adminToken = res.body.adminToken;
	});

	it("should return admin details when provided with a valid admin token", async () => {
		const res = await request(app)
			.get("/admin")
			.set("Authorization", `Bearer ${adminToken}`);

		expect(res.status).toBe(200);
		expect(res.body.adminData).toHaveProperty("email", "admin@example.com");
		expect(res.body.adminData).toHaveProperty("username", "collins");
		expect(res.body).toHaveProperty("message", "Admin Details Have been Sent");
	});

	it("should return 401 if no token is provided", async () => {
		const res = await request(app).get("/admin");
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: Authorization header is missing or invalid"
		);
	});

	it("should return 401 if token is invalid", async () => {
		const res = await request(app)
			.get("/admin")
			.set("Authorization", "Bearer invalidtoken");

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: jwt malformed"
		);
	});
});

describe("AdminRoute - addEvent", () => {
	let adminToken: string;

	beforeAll(async () => {
		const res = await request(app).post("/admin/register").send({
			username: "collins",
			email: "adminaddevent@example.com",
			password: "password123",
		});
		adminToken = res.body.adminToken;
	});

	it("should add an event and return 201 with event data", async () => {
		const eventData = {
			title: "Tech Conference",
			about: "A conference about the latest in tech.",
			totalSeats: 100,
			category: "Technology",
			price: 50,
		};

		const res = await request(app)
			.post("/admin/event")
			.set("Authorization", `Bearer ${adminToken}`)
			.send(eventData);

		expect(res.status).toBe(201);
		expect(res.body.event).toHaveProperty("title", eventData.title);
		expect(res.body.event).toHaveProperty("about", eventData.about);
		expect(res.body.event).toHaveProperty("totalSeats", eventData.totalSeats);
		expect(res.body.event).toHaveProperty("category", eventData.category);
		expect(res.body.event).toHaveProperty("price", eventData.price);
	});

	it("should return 400 if required fields are missing", async () => {
		const res = await request(app)
			.post("/admin/event")
			.set("Authorization", `Bearer ${adminToken}`)
			.send({
				title: "Incomplete Event",
			});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error");
		expect(res.body.message).toBe("about is required");
	});

	it("should return 401 if no admin token is provided", async () => {
		const eventData = {
			title: "Tech Conference",
			about: "A conference about the latest in tech.",
			totalSeats: 100,
			category: "Technology",
			price: 50,
		};

		const res = await request(app).post("/admin/event").send(eventData);

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: Authorization header is missing or invalid"
		);
	});

	it("should return 400 for invalid event data", async () => {
		const eventData = {
			title: "A",
			about: "Short",
			totalSeats: -10,
			category: "",
			price: -5,
		};

		const res = await request(app)
			.post("/admin/event")
			.set("Authorization", `Bearer ${adminToken}`)
			.send(eventData);

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error");
		expect(res.body.message).toBe(
			"title length must be at least 3 characters long"
		);
	});
});

describe("AdminRoute - getAllEvents", () => {
	let adminToken: string;

	beforeAll(async () => {
		const res = await request(app).post("/admin/register").send({
			username: "eventadmin",
			email: "eventadmin@example.com",
			password: "password123",
		});
		adminToken = res.body.adminToken;

		const events = [
			{
				title: "Tech Conference",
				about: "A conference about the latest in tech.",
				totalSeats: 100,
				category: "Technology",
				price: 50,
			},
			{
				title: "Music Festival",
				about: "A festival with live music.",
				totalSeats: 200,
				category: "Entertainment",
				price: 30,
			},
		];

		for (const event of events) {
			await request(app)
				.post("/admin/event")
				.set("Authorization", `Bearer ${adminToken}`)
				.send(event);
		}
	});

	it("should return all events for an authenticated admin", async () => {
		const res = await request(app)
			.get("/admin/events")
			.set("Authorization", `Bearer ${adminToken}`);

		expect(res.status).toBe(200);
		expect(res.body.events).toBeInstanceOf(Array);
		expect(res.body.events.length).toBeGreaterThanOrEqual(2);

		const titles = res.body.events.map((e: any) => e.title);
		expect(titles).toEqual(
			expect.arrayContaining(["Tech Conference", "Music Festival"])
		);
	});

	it("should return 401 if no admin token is provided", async () => {
		const res = await request(app).get("/admin/events");
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: Authorization header is missing or invalid"
		);
	});

	it("should return 401 if admin token is invalid", async () => {
		const res = await request(app)
			.get("/admin/events")
			.set("Authorization", "Bearer invalidtoken");
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: jwt malformed"
		);
	});
});

describe("AdminRoute - getEvent", () => {
	let adminToken: string;
	let eventId: string;

	beforeAll(async () => {
		const adminRes = await request(app).post("/admin/register").send({
			username: "eventadmin",
			email: "eventadmin@getevent.com",
			password: "password123",
		});
		adminToken = adminRes.body.adminToken;

		const eventData = {
			title: "GetEvent Test",
			about: "Testing getEvent endpoint.",
			totalSeats: 50,
			category: "Testing",
			price: 10,
		};
		const eventRes = await request(app)
			.post("/admin/event")
			.set("Authorization", `Bearer ${adminToken}`)
			.send(eventData);

		eventId = eventRes.body.event._id;
	});

	it("should return event details for a valid eventId and admin token", async () => {
		const res = await request(app)
			.get(`/admin/event/${eventId}`)
			.set("Authorization", `Bearer ${adminToken}`);

		expect(res.status).toBe(200);
		expect(res.body.event).toHaveProperty("_id", eventId);
		expect(res.body.event).toHaveProperty("title", "GetEvent Test");
		expect(res.body.event).toHaveProperty(
			"about",
			"Testing getEvent endpoint."
		);
		expect(res.body.event).toHaveProperty("totalSeats", 50);
		expect(res.body.event).toHaveProperty("category", "Testing");
		expect(res.body.event).toHaveProperty("price", 10);
	});

	it("should return 404 if event does not exist", async () => {
		const fakeId = "64b7f9f2f2f2f2f2f2f2f2f2";
		const res = await request(app)
			.get(`/admin/event/${fakeId}`)
			.set("Authorization", `Bearer ${adminToken}`);

		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty("error");
	});

	it("should return 401 if no admin token is provided", async () => {
		const res = await request(app).get(`/admin/event/${eventId}`);
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: Authorization header is missing or invalid"
		);
	});

	it("should return 401 if admin token is invalid", async () => {
		const res = await request(app)
			.get(`/admin/event/${eventId}`)
			.set("Authorization", "Bearer invalidtoken");
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: jwt malformed"
		);
	});
});

describe("AdminRoute - editEvent", () => {
	let adminToken: string;
	let eventId: string;

	beforeAll(async () => {
		const adminRes = await request(app).post("/admin/register").send({
			username: "editadmin",
			email: "editadmin@example.com",
			password: "password123",
		});
		adminToken = adminRes.body.adminToken;

		const eventRes = await request(app)
			.post("/admin/event")
			.set("Authorization", `Bearer ${adminToken}`)
			.send({
				title: "Original Event",
				about: "Original about",
				totalSeats: 100,
				category: "Original Category",
				price: 20,
			});
		eventId = eventRes.body.event._id;
	});

	it("should edit an event and return 200 with updated event data", async () => {
		const updatedData = {
			title: "Updated Event",
			about: "Updated about",
			totalSeats: 150,
			category: "Updated Category",
			price: 30,
		};

		const res = await request(app)
			.patch(`/admin/event/${eventId}`)
			.set("Authorization", `Bearer ${adminToken}`)
			.send(updatedData);

		expect(res.status).toBe(200);
		expect(res.body.event).toHaveProperty("_id", eventId);
		expect(res.body.event).toHaveProperty("title", updatedData.title);
		expect(res.body.event).toHaveProperty("about", updatedData.about);
		expect(res.body.event).toHaveProperty("totalSeats", updatedData.totalSeats);
		expect(res.body.event).toHaveProperty("category", updatedData.category);
		expect(res.body.event).toHaveProperty("price", updatedData.price);
	});

	it("should return 400 if required fields are invalid", async () => {
		const invalidData = {
			title: "A",
			about: "Short",
			totalSeats: -10,
			category: "",
			price: -5,
		};

		const res = await request(app)
			.patch(`/admin/event/${eventId}`)
			.set("Authorization", `Bearer ${adminToken}`)
			.send(invalidData);

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error");
		expect(res.body.message).toBe(
			"title length must be at least 3 characters long"
		);
	});

	it("should return 404 if event does not exist", async () => {
		const fakeId = "64b7f9f2f2f2f2f2f2f2f2f2";
		const res = await request(app)
			.patch(`/admin/event/${fakeId}`)
			.set("Authorization", `Bearer ${adminToken}`)
			.send({
				title: "Nonexistent Event",
				about: "Trying to edit nonexistent event",
				totalSeats: 10,
				category: "Test",
				price: 10,
			});

		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty("error");
		expect(res.body.error).toBe("Event does not exist");
	});

	it("should return 401 if no admin token is provided", async () => {
		const res = await request(app).patch(`/admin/event/${eventId}`).send({
			title: "No Auth Event",
			about: "No Auth",
			totalSeats: 10,
			category: "Test",
			price: 10,
		});

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: Authorization header is missing or invalid"
		);
	});

	it("should return 401 if admin token is invalid", async () => {
		const res = await request(app)
			.patch(`/admin/event/${eventId}`)
			.set("Authorization", "Bearer invalidtoken")
			.send({
				title: "Invalid Token Event",
				about: "Invalid Token",
				totalSeats: 10,
				category: "Test",
				price: 10,
			});

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: jwt malformed"
		);
	});
});

describe("AdminRoute - searchEvents", () => {
	let adminToken: string;

	beforeEach(async () => {
		const adminRes = await request(app).post("/admin/register").send({
			username: "searchadmin",
			email: "searchadmin@example.com",
			password: "password123",
		});
		adminToken = adminRes.body.adminToken;

		const events = [
			{
				title: "Tech Conference",
				about: "A conference about the latest in tech.",
				totalSeats: 100,
				category: "Technology",
				price: 50,
			},
			{
				title: "Music Festival",
				about: "A festival with live music.",
				totalSeats: 200,
				category: "Entertainment",
				price: 30,
			},
			{
				title: "Art Expo",
				about: "An exhibition of modern art.",
				totalSeats: 80,
				category: "Art",
				price: 20,
			},
		];

		for (const event of events) {
			await request(app)
				.post("/admin/event")
				.set("Authorization", `Bearer ${adminToken}`)
				.send(event);
		}
	});

	it("should return events matching the search key and value", async () => {
		const res = await request(app)
			.get("/admin/search")
			.set("Authorization", `Bearer ${adminToken}`)
			.query({ key: "category", value: "Technology" });

		expect(res.status).toBe(200);
		expect(res.body).toBeInstanceOf(Array);
		expect(res.body.length).toBeGreaterThanOrEqual(1);
		const categories = res.body.map((e: any) => e.category);
		expect(categories).toContain("Technology");
	});

	it("should return all events when value is 'ALL'", async () => {
		const res = await request(app)
			.get("/admin/search")
			.set("Authorization", `Bearer ${adminToken}`)
			.query({ key: "category", value: "ALL" });

		expect(res.status).toBe(200);
		expect(res.body).toBeInstanceOf(Array);
		expect(res.body.length).toBeGreaterThanOrEqual(3);
	});

	it("should return 400 if key or value is missing", async () => {
		const res = await request(app)
			.get("/admin/search")
			.set("Authorization", `Bearer ${adminToken}`)
			.query({ key: "category" });

		expect(res.status).toBe(400);
		expect(res.body.error).toBeDefined();
		expect(res.body.error).toBe(
			"Both 'key' and 'value' query parameters are required"
		);
	});

	it("should return 401 if no admin token is provided", async () => {
		const res = await request(app)
			.get("/admin/search")
			.query({ key: "category", value: "Technology" });

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: Authorization header is missing or invalid"
		);
	});

	it("should return 401 if admin token is invalid", async () => {
		const res = await request(app)
			.get("/admin/search")
			.set("Authorization", "Bearer invalidtoken")
			.query({ key: "category", value: "Technology" });

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: jwt malformed"
		);
	});
});

describe("AdminRoute - deleteEvent", () => {
	let adminToken: string;
	let eventId: string;

	beforeAll(async () => {
		const adminRes = await request(app).post("/admin/register").send({
			username: "deleteadmin",
			email: "deleteadmin@example.com",
			password: "password123",
		});
		adminToken = adminRes.body.adminToken;

		const eventRes = await request(app)
			.post("/admin/event")
			.set("Authorization", `Bearer ${adminToken}`)
			.send({
				title: "Delete Me",
				about: "This event will be deleted.",
				totalSeats: 10,
				category: "Test",
				price: 5,
			});
		eventId = eventRes.body.event._id;
	});

	it("should delete an event and return 200 with success message", async () => {
		const res = await request(app)
			.delete(`/admin/delete/${eventId}`)
			.set("Authorization", `Bearer ${adminToken}`);

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("message", "Event Deleted Successfully");
	});

	it("should return 404 if event does not exist", async () => {
		const fakeId = "64b7f9f2f2f2f2f2f2f2f2f2";
		const res = await request(app)
			.delete(`/admin/delete/${fakeId}`)
			.set("Authorization", `Bearer ${adminToken}`);

		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty("error");
		expect(res.body.error).toBe("Event does not exist");
	});

	it("should return 401 if no admin token is provided", async () => {
		const res = await request(app).delete(`/admin/delete/${eventId}`);
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: Authorization header is missing or invalid"
		);
	});

	it("should return 401 if admin token is invalid", async () => {
		const res = await request(app)
			.delete(`/admin/delete/${eventId}`)
			.set("Authorization", "Bearer invalidtoken");

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: jwt malformed"
		);
	});
});

describe("AdminRoute - getAllBookings", () => {
	let adminToken: string;
	let eventId: string;
	let userId: string;

	beforeAll(async () => {
		const adminRes = await request(app).post("/admin/register").send({
			username: "bookingadmin",
			email: "bookingadmin@example.com",
			password: "password123",
		});
		adminToken = adminRes.body.adminToken;

		const eventRes = await request(app)
			.post("/admin/event")
			.set("Authorization", `Bearer ${adminToken}`)
			.send({
				title: "Booking Test Event",
				about: "Event for booking tests.",
				totalSeats: 10,
				category: "Test",
				price: 100,
			});
		eventId = eventRes.body.event._id;

		const userRes = await request(app).post("/user/register").send({
			username: "bookinguser",
			email: "bookinguser@example.com",
			password: "password123",
		});
		userId = userRes.body.user._id;

		const addBooking = await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${userRes.body.accessToken}`)
			.send({
				eventId,
				userId,
				userDetails: {
					fullName: "bookinguser",
					email: "bookinguser@example.com",
					phoneNumber: "+1234567890",
				},
			});

		const bookingCheck = await request(app)
			.get("/user/bookings/" + userId)
			.set("Authorization", `Bearer ${userRes.body.accessToken}`);
	});

	it("should return all bookings for an authenticated admin", async () => {
		const res = await request(app)
			.get("/admin/bookings")
			.set("Authorization", `Bearer ${adminToken}`);

		expect(res.status).toBe(200);
		expect(res.body.bookings).toBeInstanceOf(Array);
		expect(res.body.bookings.length).toBeGreaterThanOrEqual(1);
		expect(res.body).toHaveProperty(
			"message",
			"All Bookings Retrieved Successfully"
		);

		const booking = res.body.bookings[0];
		expect(booking).toHaveProperty("eventId");
		expect(booking).toHaveProperty("userId");
		expect(booking).toHaveProperty("userDetails");
	});

	it("should return 401 if no admin token is provided", async () => {
		const res = await request(app).get("/admin/bookings");
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: Authorization header is missing or invalid"
		);
	});

	it("should return 401 if admin token is invalid", async () => {
		const res = await request(app)
			.get("/admin/bookings")
			.set("Authorization", "Bearer invalidtoken");
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: jwt malformed"
		);
	});
});

describe("AdminRoute - deleteBooking", () => {
	let adminToken: string;
	let bookingId: string;
	let eventId: string;
	let userId: string;

	beforeAll(async () => {
		const adminRes = await request(app).post("/admin/register").send({
			username: "deletebookingadmin",
			email: "deletebookingadmin@example.com",
			password: "password123",
		});
		adminToken = adminRes.body.adminToken;

		const eventRes = await request(app)
			.post("/admin/event")
			.set("Authorization", `Bearer ${adminToken}`)
			.send({
				title: "Event for Booking Deletion",
				about: "This event will be used to test booking deletion",
				totalSeats: 50,
				category: "Testing",
				price: 100,
			});
		eventId = eventRes.body.event._id;

		const userRes = await request(app).post("/user/register").send({
			username: "userforbooking",
			email: "userforbooking@example.com",
			password: "password123",
		});
		userId = userRes.body.user._id;

		const bookingRes = await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${userRes.body.accessToken}`)
			.send({
				eventId,
				userId,
				userDetails: {
					fullName: "Test User",
					email: "userforbooking@example.com",
					phoneNumber: "+1234567890",
				},
			});
		bookingId = bookingRes.body.booking._id;
	});

	it("should delete a booking and return 200 with success message", async () => {
		const res = await request(app)
			.delete(`/admin/booking/${bookingId}`)
			.set("Authorization", `Bearer ${adminToken}`);

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("message", "Booking Deleted Successfully");

		const verifyRes = await request(app)
			.get("/admin/bookings")
			.set("Authorization", `Bearer ${adminToken}`);
		const bookingIds = verifyRes.body.bookings.map((b: any) => b._id);
		expect(bookingIds).not.toContain(bookingId);
	});

	it("should return 404 if booking does not exist", async () => {
		const fakeId = "64b7f9f2f2f2f2f2f2f2f2f2";
		const res = await request(app)
			.delete(`/admin/booking/${fakeId}`)
			.set("Authorization", `Bearer ${adminToken}`);

		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty("error");
	});

	it("should return 401 if no admin token is provided", async () => {
		const res = await request(app).delete(`/admin/booking/${bookingId}`);
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: Authorization header is missing or invalid"
		);
	});

	it("should return 401 if admin token is invalid", async () => {
		const res = await request(app)
			.delete(`/admin/booking/${bookingId}`)
			.set("Authorization", "Bearer invalidtoken");

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: jwt malformed"
		);
	});
});

describe("AdminRoute - totalEvents", () => {
	let adminToken: string;

	beforeAll(async () => {
		const adminRes = await request(app).post("/admin/register").send({
			username: "dashboardadmin",
			email: "dashboardadmin@example.com",
			password: "password123",
		});
		adminToken = adminRes.body.adminToken;

		const events = [
			{
				title: "Tech Conference 1",
				about: "First tech conference",
				totalSeats: 100,
				category: "Technology",
				price: 50,
			},
			{
				title: "Music Festival 1",
				about: "First music festival",
				totalSeats: 200,
				category: "Entertainment",
				price: 30,
			},
			{
				title: "Art Expo 1",
				about: "First art expo",
				totalSeats: 80,
				category: "Art",
				price: 20,
			},
		];

		for (const event of events) {
			await request(app)
				.post("/admin/event")
				.set("Authorization", `Bearer ${adminToken}`)
				.send(event);
		}
	});

	it("should return the total number of events with success message", async () => {
		const res = await request(app)
			.get("/admin/dashboard/events")
			.set("Authorization", `Bearer ${adminToken}`);

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("totalEvents");
		expect(res.body.totalEvents).toEqual(3);
		expect(res.body).toHaveProperty(
			"message",
			"total events sent successfully"
		);
	});

	it("should return 0 when there are no events", async () => {
		const res = await request(app)
			.get("/admin/dashboard/events")
			.set("Authorization", `Bearer ${adminToken}`);

		expect(res.status).toBe(200);
		expect(res.body.totalEvents).toBe(0);
		expect(res.body).toHaveProperty(
			"message",
			"total events sent successfully"
		);
	});

	it("should return 401 if no admin token is provided", async () => {
		const res = await request(app).get("/admin/dashboard/events");
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: Authorization header is missing or invalid"
		);
	});

	it("should return 401 if admin token is invalid", async () => {
		const res = await request(app)
			.get("/admin/dashboard/events")
			.set("Authorization", "Bearer invalidtoken");

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: jwt malformed"
		);
	});

	it("should reflect real-time changes in event count", async () => {
		const initialRes = await request(app)
			.get("/admin/dashboard/events")
			.set("Authorization", `Bearer ${adminToken}`);
		const initialCount = initialRes.body.totalEvents;

		await request(app)
			.post("/admin/event")
			.set("Authorization", `Bearer ${adminToken}`)
			.send({
				title: "New Test Event",
				about: "Testing real-time count",
				totalSeats: 50,
				category: "Test",
				price: 10,
			});

		const updatedRes = await request(app)
			.get("/admin/dashboard/events")
			.set("Authorization", `Bearer ${adminToken}`);

		expect(updatedRes.body.totalEvents).toBe(initialCount + 1);
	});
});

describe("AdminRoute - totalBookings", () => {
	let adminToken: string;
	let eventId: string;
	let userId1: string;
	let userId2: string;
	let accessToken1: string;
	let accessToken2: string;
	let firstBooking: any;

	beforeEach(async () => {
		const adminRes = await request(app).post("/admin/register").send({
			username: "bookingsadmin",
			email: "bookingsadmin@example.com",
			password: "password123",
		});
		adminToken = adminRes.body.adminToken;

		const eventRes = await request(app)
			.post("/admin/event")
			.set("Authorization", `Bearer ${adminToken}`)
			.send({
				title: "Event for Bookings Count",
				about: "Event for testing bookings count",
				totalSeats: 100,
				category: "Testing",
				price: 50,
			});
		eventId = eventRes.body.event._id;

		const userRes1 = await request(app).post("/user/register").send({
			username: "bookingsuser1",
			email: "bookingsuser@example.com",
			password: "password123",
		});
		userId1 = userRes1.body.user._id;
		accessToken1 = userRes1.body.accessToken;

		const userRes2 = await request(app).post("/user/register").send({
			username: "bookingsuser2",
			email: "secondbookingsuser@example.com",
			password: "password123",
		});
		userId2 = userRes2.body.user._id;
		accessToken2 = userRes2.body.accessToken;

		firstBooking = await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${accessToken1}`)
			.send({
				eventId,
				userId: userId1,
				userDetails: {
					fullName: "Test User",
					email: "bookingsuser@example.com",
					phoneNumber: "+1234567890",
				},
			});

		const secondBooking = await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${accessToken2}`)
			.send({
				eventId,
				userId: userId2,
				userDetails: {
					fullName: "Test User",
					email: "bookingsuser@example.com",
					phoneNumber: "+1234567890",
				},
			});
	});

	it("should return the total number of active bookings with success message", async () => {
		const res = await request(app)
			.get("/admin/dashboard/bookings")
			.set("Authorization", `Bearer ${adminToken}`);

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("totalBookings");
		expect(res.body.totalBookings).toEqual(2);
		expect(res.body).toHaveProperty(
			"message",
			"total bookings sent successfully"
		);
	});

	it("should return 0 when there are no active bookings", async () => {
		const bookings = await mongoose.connection
			.db!.collection("bookings")
			.find({})
			.toArray();
		for (const booking of bookings) {
			await mongoose.connection
				.db!.collection("bookings")
				.updateOne({ _id: booking._id }, { $set: { status: false } });
		}

		const res = await request(app)
			.get("/admin/dashboard/bookings")
			.set("Authorization", `Bearer ${adminToken}`);

		expect(res.status).toBe(200);
		expect(res.body.totalBookings).toBe(0);
		expect(res.body).toHaveProperty(
			"message",
			"total bookings sent successfully"
		);
	});

	it("should not count cancelled bookings", async () => {
		const initialRes = await request(app)
			.get("/admin/dashboard/bookings")
			.set("Authorization", `Bearer ${adminToken}`);
		const initialCount = initialRes.body.totalBookings;

		await request(app)
			.patch(`/user/booking/${firstBooking.body.booking._id}`)
			.set("Authorization", `Bearer ${accessToken1}`);

		const updatedRes = await request(app)
			.get("/admin/dashboard/bookings")
			.set("Authorization", `Bearer ${adminToken}`);

		expect(updatedRes.body.totalBookings).toBe(initialCount - 1);
	});

	it("should return 401 if no admin token is provided", async () => {
		const res = await request(app).get("/admin/dashboard/bookings");
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: Authorization header is missing or invalid"
		);
	});

	it("should return 401 if admin token is invalid", async () => {
		const res = await request(app)
			.get("/admin/dashboard/bookings")
			.set("Authorization", "Bearer invalidtoken");

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: jwt malformed"
		);
	});
});

describe("AdminRoute - mostBookedEvents", () => {
	let adminToken: string;
	let eventId1: string;
	let eventId2: string;
	let userId1: string;
	let userId2: string;
	let accessToken1: string;
	let accessToken2: string;

	beforeEach(async () => {
		const adminRes = await request(app).post("/admin/register").send({
			username: "mostbookedadmin",
			email: "mostbookedadmin@example.com",
			password: "password123",
		});
		adminToken = adminRes.body.adminToken;

		const eventRes1 = await request(app)
			.post("/admin/event")
			.set("Authorization", `Bearer ${adminToken}`)
			.send({
				title: "Popular Tech Conference",
				about: "Very popular tech event",
				totalSeats: 100,
				category: "Technology",
				price: 100,
			});
		eventId1 = eventRes1.body.event._id;

		const eventRes2 = await request(app)
			.post("/admin/event")
			.set("Authorization", `Bearer ${adminToken}`)
			.send({
				title: "Less Popular Music Festival",
				about: "Less popular music event",
				totalSeats: 200,
				category: "Music",
				price: 50,
			});
		eventId2 = eventRes2.body.event._id;

		const userRes1 = await request(app).post("/user/register").send({
			username: "mostbookeduser1",
			email: "mostbookeduser1@example.com",
			password: "password123",
		});
		userId1 = userRes1.body.user._id;
		accessToken1 = userRes1.body.accessToken;

		const userRes2 = await request(app).post("/user/register").send({
			username: "mostbookeduser2",
			email: "mostbookeduser2@example.com",
			password: "password123",
		});
		userId2 = userRes2.body.user._id;
		accessToken2 = userRes2.body.accessToken;

		await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${accessToken1}`)
			.send({
				eventId: eventId1,
				userId: userId1,
				userDetails: {
					fullName: "Test User 1",
					email: "mostbookeduser1@example.com",
					phoneNumber: "+1234567890",
				},
			});

		await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${accessToken1}`)
			.send({
				eventId: eventId2,
				userId: userId1,
				userDetails: {
					fullName: "Test User 1",
					email: "mostbookeduser1@example.com",
					phoneNumber: "+1234567890",
				},
			});

		await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${accessToken2}`)
			.send({
				eventId: eventId1,
				userId: userId2,
				userDetails: {
					fullName: "Test User 2",
					email: "mostbookeduser2@example.com",
					phoneNumber: "+1234567890",
				},
			});
	});

	it("should return the most booked events with correct data structure", async () => {
		const res = await request(app)
			.get("/admin/dashboard/most-booked-events")
			.set("Authorization", `Bearer ${adminToken}`);

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("mostBookedEvents");
		expect(res.body).toHaveProperty(
			"message",
			"most-booked-events sent successfully"
		);

		if (res.body.mostBookedEvents) {
			const event = res.body.mostBookedEvents[0];
			expect(event).toHaveProperty("eventId");
			expect(event).toHaveProperty("title");
			expect(event).toHaveProperty("bookingCount");
			expect(event).toHaveProperty("totalSeats");
		}
	});

	it("should correctly identify the most booked event", async () => {
		const res = await request(app)
			.get("/admin/dashboard/most-booked-events")
			.set("Authorization", `Bearer ${adminToken}`);

		expect(res.status).toBe(200);

		if (res.body.mostBookedEvents) {
			const popularEvent = res.body.mostBookedEvents[0];
			expect(popularEvent).toBeDefined();
			expect(popularEvent.bookingCount).toBe(2);
			expect(popularEvent.title).toBe("Popular Tech Conference");
		}
	});

	it("should return null when there are no bookings", async () => {
		await mongoose.connection.db!.collection("bookings").deleteMany({});

		const res = await request(app)
			.get("/admin/dashboard/most-booked-events")
			.set("Authorization", `Bearer ${adminToken}`);

		expect(res.status).toBe(200);
		expect(res.body.mostBookedEvents).toBeNull();
		expect(res.body).toHaveProperty(
			"message",
			"most-booked-events sent successfully"
		);
	});

	it("should handle ties in booking counts", async () => {
		await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${accessToken2}`)
			.send({
				eventId: eventId2,
				userId: userId2,
				userDetails: {
					fullName: "Test User 2",
					email: "mostbookeduser2@example.com",
					phoneNumber: "+1234567890",
				},
			});

		const res = await request(app)
			.get("/admin/dashboard/most-booked-events")
			.set("Authorization", `Bearer ${adminToken}`);

		expect(res.status).toBe(200);
		expect(res.body.mostBookedEvents.length).toBe(2);

		const event1 = res.body.mostBookedEvents[0];
		const event2 = res.body.mostBookedEvents[1];

		expect(event1.bookingCount).toBe(2);
		expect(event2.bookingCount).toBe(2);
	});

	it("should ignore cancelled bookings in the count", async () => {
		const bookingRes = await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${accessToken2}`)
			.send({
				eventId: eventId2,
				userId: userId2,
				userDetails: {
					fullName: "Test User 2",
					email: "mostbookeduser2@example.com",
					phoneNumber: "+1234567890",
				},
			});

		const bookingId = bookingRes.body.booking._id;

		await request(app)
			.patch(`/user/booking/${bookingId}`)
			.set("Authorization", `Bearer ${accessToken2}`);

		const res = await request(app)
			.get("/admin/dashboard/most-booked-events")
			.set("Authorization", `Bearer ${adminToken}`);

		expect(res.status).toBe(200);

		if (res.body.mostBookedEvents) {
			expect(res.body.mostBookedEvents.length).toBe(1);

			const event = res.body.mostBookedEvents[0];
			expect(event.bookingCount).toBe(2);
		}
	});

	it("should return 401 if no admin token is provided", async () => {
		const res = await request(app).get("/admin/dashboard/most-booked-events");

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: Authorization header is missing or invalid"
		);
	});

	it("should return 401 if admin token is invalid", async () => {
		const res = await request(app)
			.get("/admin/dashboard/most-booked-events")
			.set("Authorization", "Bearer invalidtoken");

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: jwt malformed"
		);
	});
});

describe("AdminRoute - totalRevenue", () => {
	let adminToken: string;
	let eventId1: string;
	let eventId2: string;
	let userId1: string;
	let userId2: string;
	let accessToken1: string;
	let accessToken2: string;

	beforeEach(async () => {
		const adminRes = await request(app).post("/admin/register").send({
			username: "revenueadmin",
			email: "revenueadmin@example.com",
			password: "password123",
		});
		adminToken = adminRes.body.adminToken;

		const eventRes1 = await request(app)
			.post("/admin/event")
			.set("Authorization", `Bearer ${adminToken}`)
			.send({
				title: "Premium Tech Conference",
				about: "High-end tech event",
				totalSeats: 100,
				category: "Technology",
				price: 200,
			});
		eventId1 = eventRes1.body.event._id;

		const eventRes2 = await request(app)
			.post("/admin/event")
			.set("Authorization", `Bearer ${adminToken}`)
			.send({
				title: "Standard Music Festival",
				about: "Regular music event",
				totalSeats: 200,
				category: "Music",
				price: 50,
			});
		eventId2 = eventRes2.body.event._id;

		const userRes1 = await request(app).post("/user/register").send({
			username: "revenueuser1",
			email: "revenueuser1@example.com",
			password: "password123",
		});
		userId1 = userRes1.body.user._id;
		accessToken1 = userRes1.body.accessToken;

		const userRes2 = await request(app).post("/user/register").send({
			username: "revenueuser2",
			email: "revenueuser2@example.com",
			password: "password123",
		});
		userId2 = userRes2.body.user._id;
		accessToken2 = userRes2.body.accessToken;

		await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${accessToken1}`)
			.send({
				eventId: eventId1,
				userId: userId1,
				userDetails: {
					fullName: "Test User 1",
					email: "revenueuser1@example.com",
					phoneNumber: "+1234567890",
				},
			});

		await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${accessToken2}`)
			.send({
				eventId: eventId1,
				userId: userId2,
				userDetails: {
					fullName: "Test User 2",
					email: "revenueuser2@example.com",
					phoneNumber: "+1234567890",
				},
			});

		await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${accessToken1}`)
			.send({
				eventId: eventId2,
				userId: userId1,
				userDetails: {
					fullName: "Test User 1",
					email: "revenueuser1@example.com",
					phoneNumber: "+1234567890",
				},
			});
	});

	it("should return the total revenue with correct data structure", async () => {
		const res = await request(app)
			.get("/admin/dashboard/total-revenue")
			.set("Authorization", `Bearer ${adminToken}`);

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("totalRevenue");
		expect(res.body).toHaveProperty(
			"message",
			"Total revenue fetched successfully"
		);
		expect(typeof res.body.totalRevenue).toBe("number");
	});

	it("should correctly calculate total revenue from all active bookings", async () => {
		const res = await request(app)
			.get("/admin/dashboard/total-revenue")
			.set("Authorization", `Bearer ${adminToken}`);

		expect(res.status).toBe(200);
		expect(res.body.totalRevenue).toBe(450);
	});

	it("should return 0 when there are no active bookings", async () => {
		const bookings = await mongoose.connection
			.db!.collection("bookings")
			.find({})
			.toArray();
		for (const booking of bookings) {
			await mongoose.connection
				.db!.collection("bookings")
				.updateOne({ _id: booking._id }, { $set: { status: false } });
		}

		const res = await request(app)
			.get("/admin/dashboard/total-revenue")
			.set("Authorization", `Bearer ${adminToken}`);

		expect(res.status).toBe(200);
		expect(res.body.totalRevenue).toBe(0);
	});

	it("should ignore cancelled bookings in revenue calculation", async () => {
		const initialRes = await request(app)
			.get("/admin/dashboard/total-revenue")
			.set("Authorization", `Bearer ${adminToken}`);
		const initialRevenue = initialRes.body.totalRevenue;

		const bookingRes = await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${accessToken2}`)
			.send({
				eventId: eventId2,
				userId: userId2,
				userDetails: {
					fullName: "Test User 2",
					email: "revenueuser2@example.com",
					phoneNumber: "+1234567890",
				},
			});

		const bookingId = bookingRes.body.booking._id;

		await request(app)
			.patch(`/user/booking/${bookingId}`)
			.set("Authorization", `Bearer ${accessToken2}`);

		const updatedRes = await request(app)
			.get("/admin/dashboard/total-revenue")
			.set("Authorization", `Bearer ${adminToken}`);

		expect(updatedRes.body.totalRevenue).toBe(initialRevenue);
	});

	it("should reflect real-time changes in revenue", async () => {
		const initialRes = await request(app)
			.get("/admin/dashboard/total-revenue")
			.set("Authorization", `Bearer ${adminToken}`);
		const initialRevenue = initialRes.body.totalRevenue;

		await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${accessToken2}`)
			.send({
				eventId: eventId2,
				userId: userId2,
				userDetails: {
					fullName: "Test User 2",
					email: "revenueuser2@example.com",
					phoneNumber: "+1234567890",
				},
			});

		const updatedRes = await request(app)
			.get("/admin/dashboard/total-revenue")
			.set("Authorization", `Bearer ${adminToken}`);

		expect(updatedRes.body.totalRevenue).toBe(initialRevenue + 50);
	});

	it("should return 401 if no admin token is provided", async () => {
		const res = await request(app).get("/admin/dashboard/total-revenue");

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: Authorization header is missing or invalid"
		);
	});

	it("should return 401 if admin token is invalid", async () => {
		const res = await request(app)
			.get("/admin/dashboard/total-revenue")
			.set("Authorization", "Bearer invalidtoken");

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: jwt malformed"
		);
	});
});
