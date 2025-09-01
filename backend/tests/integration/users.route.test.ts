import request from "supertest";
import app from "../../src/app";
import mongoose from "mongoose";
import TokenUtil from "../../src/utilities/token.util";

describe("UserRoute - register", () => {
	it("should register a user and return 201 with output data", async () => {
		const res = await request(app).post("/user/register").send({
			username: "collins",
			email: "user@example.com",
			password: "password123",
		});
		expect(res.status).toBe(201);
		expect(res.body.user).toHaveProperty("email", "user@example.com");
		expect(res.body).toHaveProperty("accessToken");
		expect(res.body).toHaveProperty("message", "Registration Successful");
	});

	it("should not allow duplicate user registration", async () => {
		await request(app).post("/user/register").send({
			username: "collins",
			email: "user@example.com",
			password: "password123",
		});

		const res = await request(app).post("/user/register").send({
			username: "collins",
			email: "user@example.com",
			password: "password123",
		});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error");
		expect(res.body.error).toBe("User already exists");
	});

	it("should return 400 if required fields are missing", async () => {
		const res = await request(app).post("/user/register").send({
			email: "user@example.com",
		});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error");
		expect(res.body.message).toBe("username is required");
	});

	it("should return 400 for invalid email format", async () => {
		const res = await request(app).post("/user/register").send({
			username: "collins",
			email: "invalid-email",
			password: "password123",
		});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error");
		expect(res.body.message).toBe("email must be a valid email");
	});
});

describe("UserRoute - login", () => {
	beforeEach(async () => {
		await request(app).post("/user/register").send({
			username: "collins",
			email: "user2@example.com",
			password: "password123",
		});
	});

	it("should login an user and return 200 with output data", async () => {
		const res = await request(app).post("/user/login").send({
			email: "user2@example.com",
			password: "password123",
		});

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("email", "user2@example.com");
		expect(res.body).toHaveProperty("accessToken");
		expect(res.body).toHaveProperty("message", "Login Successful");
	});

	it("should return 400 for invalid credentials", async () => {
		const res = await request(app).post("/user/login").send({
			email: "user2@example.com",
			password: "wrongpassword",
		});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error");
		expect(res.body.error).toBe("Invalid password");
	});

	it("should return 400 if required fields are missing", async () => {
		const res = await request(app).post("/user/login").send({
			email: "user2@example.com",
		});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error");
		expect(res.body.message).toBe("password is required");
	});

	it("should return 400 for invalid email format", async () => {
		const res = await request(app).post("/user/login").send({
			email: "invalid-email",
			password: "password123",
		});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error");
		expect(res.body.message).toBe("email must be a valid email");
	});
});

describe("UserRoute - getUser", () => {
	let accessToken: string;

	beforeAll(async () => {
		const res = await request(app).post("/user/register").send({
			username: "collins",
			email: "user@example.com",
			password: "password123",
		});
		accessToken = res.body.accessToken;
	});

	it("should return user details when provided with a valid user token", async () => {
		const res = await request(app)
			.get("/user")
			.set("Authorization", `Bearer ${accessToken}`);

		expect(res.status).toBe(200);
		expect(res.body.userData).toHaveProperty("email", "user@example.com");
		expect(res.body.userData).toHaveProperty("username", "collins");
		expect(res.body).toHaveProperty("message", "User Details Have been Sent");
	});

	it("should return 401 if no token is provided", async () => {
		const res = await request(app).get("/user");
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: Authorization header is missing or invalid"
		);
	});

	it("should return 401 if token is invalid", async () => {
		const res = await request(app)
			.get("/user")
			.set("Authorization", "Bearer invalidtoken");

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: jwt malformed"
		);
	});
});

describe("UserRoute - getAllEvents", () => {
	let adminToken: string;
	let accessToken: string;

	beforeAll(async () => {
		const adminRes = await request(app).post("/admin/register").send({
			username: "eventuser",
			email: "eventuser@example.com",
			password: "password123",
		});
		adminToken = adminRes.body.adminToken;

		const res = await request(app).post("/user/register").send({
			username: "eventuser",
			email: "eventuser@example.com",
			password: "password123",
		});
		accessToken = res.body.accessToken;

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

	it("should return all events for an authenticated user", async () => {
		const res = await request(app)
			.get("/user/events")
			.set("Authorization", `Bearer ${accessToken}`);

		expect(res.status).toBe(200);
		expect(res.body.events).toBeInstanceOf(Array);
		expect(res.body.events.length).toEqual(2);

		const titles = res.body.events.map((e: any) => e.title);
		expect(titles).toEqual(
			expect.arrayContaining(["Tech Conference", "Music Festival"])
		);
	});

	it("should return 401 if no user token is provided", async () => {
		const res = await request(app).get("/user/events");
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: Authorization header is missing or invalid"
		);
	});

	it("should return 401 if user token is invalid", async () => {
		const res = await request(app)
			.get("/user/events")
			.set("Authorization", "Bearer invalidtoken");
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: jwt malformed"
		);
	});
});

describe("UserRoute - searchEvents", () => {
	let adminToken: string;
	let accessToken: string;

	beforeEach(async () => {
		const adminRes = await request(app).post("/admin/register").send({
			username: "searchadmin",
			email: "searchadmin@example.com",
			password: "password123",
		});
		adminToken = adminRes.body.adminToken;

		const userRes = await request(app).post("/user/register").send({
			username: "searchuser",
			email: "searchuser@example.com",
			password: "password123",
		});
		accessToken = userRes.body.accessToken;

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
			.get("/user/search")
			.set("Authorization", `Bearer ${accessToken}`)
			.query({ key: "category", value: "Technology" });

		expect(res.status).toBe(200);
		expect(res.body).toBeInstanceOf(Array);
		expect(res.body.length).toEqual(1);
		const categories = res.body.map((e: any) => e.category);
		expect(categories).toContain("Technology");
	});

	it("should return all events when value is 'ALL'", async () => {
		const res = await request(app)
			.get("/user/search")
			.set("Authorization", `Bearer ${accessToken}`)
			.query({ key: "category", value: "ALL" });

		expect(res.status).toBe(200);
		expect(res.body).toBeInstanceOf(Array);
		expect(res.body.length).toEqual(3);
	});

	it("should return 400 if key or value is missing", async () => {
		const res = await request(app)
			.get("/user/search")
			.set("Authorization", `Bearer ${accessToken}`)
			.query({ key: "category" });

		expect(res.status).toBe(400);
		expect(res.body.error).toBeDefined();
	});

	it("should return 401 if no admin token is provided", async () => {
		const res = await request(app)
			.get("/user/search")
			.query({ key: "category", value: "Technology" });

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: Authorization header is missing or invalid"
		);
	});

	it("should return 401 if admin token is invalid", async () => {
		const res = await request(app)
			.get("/user/search")
			.set("Authorization", "Bearer invalidtoken")
			.query({ key: "category", value: "Technology" });

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: jwt malformed"
		);
	});
});

describe("UserRoute - addBooking", () => {
	let adminToken: string;
	let accessToken: string;
	let userId: string;
	let eventId: string;

	beforeEach(async () => {
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
				title: "Test Event for Booking",
				about: "Event for testing bookings",
				totalSeats: 2,
				category: "Test",
				price: 100,
			});
		eventId = eventRes.body.event._id;

		const userRes = await request(app).post("/user/register").send({
			username: "bookinguser",
			email: "bookinguser@example.com",
			password: "password123",
		});
		accessToken = userRes.body.accessToken;
		userId = userRes.body.user._id;
	});

	it("should create a booking and return 201 with booking data", async () => {
		const res = await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				eventId,
				userId,
				userDetails: {
					fullName: "Test User",
					email: "bookinguser@example.com",
					phoneNumber: "+1234567890",
				},
			});

		expect(res.status).toBe(201);
		expect(res.body.booking).toHaveProperty("_id");
		expect(res.body.booking).toHaveProperty("eventId", eventId);
		expect(res.body.booking).toHaveProperty("userId", userId);
		expect(res.body.booking.userDetails).toHaveProperty(
			"fullName",
			"Test User"
		);
		expect(res.body).toHaveProperty("message", "Booking Created Successfully");
	});

	it("should return 400 if user tries to book same event twice", async () => {
		await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				eventId,
				userId,
				userDetails: {
					fullName: "Test User",
					email: "bookinguser@example.com",
					phoneNumber: "+1234567890",
				},
			});

		const res = await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				eventId,
				userId,
				userDetails: {
					fullName: "Test User",
					email: "bookinguser@example.com",
					phoneNumber: "+1234567890",
				},
			});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty(
			"error",
			"User has already booked the event"
		);
	});

	it("should return 400 if event has no available seats", async () => {
		const userRes2 = await request(app).post("/user/register").send({
			username: "bookinguser2",
			email: "bookinguser2@example.com",
			password: "password123",
		});
		const accessToken2 = userRes2.body.accessToken;
		const userId2 = userRes2.body.user._id;

		await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				eventId,
				userId,
				userDetails: {
					fullName: "Test User",
					email: "bookinguser@example.com",
					phoneNumber: "+1234567890",
				},
			});

		await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${accessToken2}`)
			.send({
				eventId,
				userId: userId2,
				userDetails: {
					fullName: "Test User 2",
					email: "bookinguser2@example.com",
					phoneNumber: "+1234567890",
				},
			});

		const userRes3 = await request(app).post("/user/register").send({
			username: "bookinguser3",
			email: "bookinguser3@example.com",
			password: "password123",
		});
		const accessToken3 = userRes3.body.accessToken;
		const userId3 = userRes3.body.user._id;

		const res = await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${accessToken3}`)
			.send({
				eventId,
				userId: userId3,
				userDetails: {
					fullName: "Test User 3",
					email: "bookinguser3@example.com",
					phoneNumber: "+1234567890",
				},
			});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error", "No seats available for booking");
	});

	it("should recreate booking if previous booking was cancelled", async () => {
		const firstBooking = await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				eventId,
				userId,
				userDetails: {
					fullName: "Test User",
					email: "bookinguser@example.com",
					phoneNumber: "+1234567890",
				},
			});

		const bookingId = firstBooking.body.booking._id;

		await request(app)
			.patch(`/user/booking/${bookingId}`)
			.set("Authorization", `Bearer ${accessToken}`);

		const res = await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				eventId,
				userId,
				userDetails: {
					fullName: "Test User",
					email: "bookinguser@example.com",
					phoneNumber: "+1234567890",
				},
			});

		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty(
			"message",
			"Booking Recreated Successfully"
		);
		expect(res.body.booking._id).toBe(bookingId);
	});

	it("should return 404 if event does not exist", async () => {
		const fakeEventId = "64b7f9f2f2f2f2f2f2f2f2f2";
		const res = await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				eventId: fakeEventId,
				userId,
				userDetails: {
					fullName: "Test User",
					email: "bookinguser@example.com",
					phoneNumber: "+1234567890",
				},
			});

		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty("error", "Event does not exist");
	});

	it("should return 400 if required fields are missing", async () => {
		const res = await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				eventId,
				userId,
				userDetails: {
					fullName: "Test User 3",
				},
			});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error");
		expect(res.body.message).toBe("userDetails.email is required");
	});

	it("should return 400 for invalid user details", async () => {
		const res = await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				eventId,
				userId,
				userDetails: {
					fullName: "A",
					email: "invalid-email",
					phoneNumber: "123",
				},
			});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error");
		expect(res.body.message).toBe(
			"userDetails.fullName length must be at least 3 characters long"
		);
	});

	it("should return 401 if no user token is provided", async () => {
		const res = await request(app)
			.post("/user/booking")
			.send({
				eventId,
				userId,
				userDetails: {
					fullName: "Test User",
					email: "bookinguser@example.com",
					phoneNumber: "+1234567890",
				},
			});

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: Authorization header is missing or invalid"
		);
	});

	it("should return 401 if user token is invalid", async () => {
		const res = await request(app)
			.post("/user/booking")
			.set("Authorization", "Bearer invalidtoken")
			.send({
				eventId,
				userId,
				userDetails: {
					fullName: "Test User",
					email: "bookinguser@example.com",
					phoneNumber: "+1234567890",
				},
			});

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: jwt malformed"
		);
	});
});

describe("UserRoute - getUserBookings", () => {
	let adminToken: string;
	let userToken: string;
	let userId: string;
	let eventId: string;
	let eventId2: string;
	let bookingId: string;

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
				title: "Test Event for Bookings",
				about: "Event for testing user bookings",
				totalSeats: 10,
				category: "Test",
				price: 100,
			});
		eventId = eventRes.body.event._id;

		const eventRes2 = await request(app)
			.post("/admin/event")
			.set("Authorization", `Bearer ${adminToken}`)
			.send({
				title: "Second Test Event for Bookings",
				about: "Event for testing user bookings2",
				totalSeats: 10,
				category: "Test",
				price: 100,
			});
		eventId2 = eventRes2.body.event._id;

		const userRes = await request(app).post("/user/register").send({
			username: "bookingsuser",
			email: "bookingsuser@example.com",
			password: "password123",
		});
		userToken = userRes.body.accessToken;
		userId = userRes.body.user._id;

		const bookingRes = await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${userToken}`)
			.send({
				eventId,
				userId,
				userDetails: {
					fullName: "Test User",
					email: "bookingsuser@example.com",
					phoneNumber: "+1234567890",
				},
			});

		bookingId = bookingRes.body.booking._id;
	});

	it("should return all bookings for a specific user", async () => {
		const res = await request(app)
			.get(`/user/bookings/${userId}`)
			.set("Authorization", `Bearer ${userToken}`);

		expect(res.status).toBe(200);
		expect(res.body.bookings).toBeInstanceOf(Array);
		expect(res.body.bookings.length).toBe(1);
		expect(res.body.bookings[0]).toHaveProperty("eventId");
		expect(res.body.bookings[0]).toHaveProperty("userId");
		expect(res.body.bookings[0].userDetails).toHaveProperty(
			"fullName",
			"Test User"
		);
		expect(res.body).toHaveProperty(
			"message",
			"User Bookings Retrieved Successfully"
		);
	});

	it("should return empty array if user has no bookings", async () => {
		const newUserRes = await request(app).post("/user/register").send({
			username: "nobookingsuser",
			email: "nobookingsuser@example.com",
			password: "password123",
		});
		const newUserId = newUserRes.body.user._id;

		const res = await request(app)
			.get(`/user/bookings/${newUserId}`)
			.set("Authorization", `Bearer ${newUserRes.body.accessToken}`);

		expect(res.status).toBe(200);
		expect(res.body.bookings).toBeInstanceOf(Array);
		expect(res.body.bookings.length).toBe(0);
	});

	it("should only return inactive bookings (status: false)", async () => {
		await request(app)
			.patch(`/user/booking/${bookingId}`)
			.set("Authorization", `Bearer ${userToken}`);

		const res = await request(app)
			.get(`/user/bookings/${userId}`)
			.set("Authorization", `Bearer ${userToken}`);

		expect(res.status).toBe(200);
		expect(res.body.bookings.length).toBe(1);
	});

	it("should return bookings sorted by creation date (oldest first)", async () => {
		await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${userToken}`)
			.send({
				eventId: eventId2,
				userId,
				userDetails: {
					fullName: "Test User",
					email: "bookingsuser@example.com",
					phoneNumber: "+1234567891",
				},
			});

		const res = await request(app)
			.get(`/user/bookings/${userId}`)
			.set("Authorization", `Bearer ${userToken}`);

		expect(res.status).toBe(200);
		expect(res.body.bookings.length).toBe(2);
		const firstDate = new Date(res.body.bookings[0].createdOn);
		const secondDate = new Date(res.body.bookings[1].createdOn);
		expect(firstDate.getTime()).toBeLessThanOrEqual(secondDate.getTime());
	});

	it("should populate event details in the response", async () => {
		const res = await request(app)
			.get(`/user/bookings/${userId}`)
			.set("Authorization", `Bearer ${userToken}`);

		expect(res.status).toBe(200);
		expect(res.body.bookings[0].eventId).toHaveProperty("title");
		expect(res.body.bookings[0].eventId).toHaveProperty("category");
		expect(res.body.bookings[0].eventId).toHaveProperty("totalSeats");
	});

	it("should populate user details in the response", async () => {
		const res = await request(app)
			.get(`/user/bookings/${userId}`)
			.set("Authorization", `Bearer ${userToken}`);

		expect(res.status).toBe(200);
		expect(res.body.bookings[0].userId).toHaveProperty("username");
		expect(res.body.bookings[0].userId).toHaveProperty("email");
	});

	it("should return 401 if no user token is provided", async () => {
		const res = await request(app).get(`/user/bookings/${userId}`);

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: Authorization header is missing or invalid"
		);
	});

	it("should return 401 if user token is invalid", async () => {
		const res = await request(app)
			.get(`/user/bookings/${userId}`)
			.set("Authorization", "Bearer invalidtoken");

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: jwt malformed"
		);
	});
});

describe("UserRoute - cancelBooking", () => {
	let adminToken: string;
	let userToken: string;
	let userId: string;
	let eventId: string;
	let bookingId: string;

	beforeEach(async () => {
		const adminRes = await request(app).post("/admin/register").send({
			username: "canceladmin",
			email: "canceladmin@example.com",
			password: "password123",
		});
		adminToken = adminRes.body.adminToken;

		const eventRes = await request(app)
			.post("/admin/event")
			.set("Authorization", `Bearer ${adminToken}`)
			.send({
				title: "Event for Cancellation",
				about: "Event for testing booking cancellation",
				totalSeats: 10,
				category: "Test",
				price: 100,
			});
		eventId = eventRes.body.event._id;

		const userRes = await request(app).post("/user/register").send({
			username: "canceluser",
			email: "canceluser@example.com",
			password: "password123",
		});
		userToken = userRes.body.accessToken;
		userId = userRes.body.user._id;

		const bookingRes = await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${userToken}`)
			.send({
				eventId,
				userId,
				userDetails: {
					fullName: "Cancel User",
					email: "canceluser@example.com",
					phoneNumber: "+1234567890",
				},
			});
		bookingId = bookingRes.body.booking._id;
	});

	it("should cancel a booking and return 200 with success message", async () => {
		const res = await request(app)
			.patch(`/user/booking/${bookingId}`)
			.set("Authorization", `Bearer ${userToken}`);

		expect(res.status).toBe(200);
		expect(res.body.booking).toHaveProperty("_id", bookingId);
		expect(res.body.booking).toHaveProperty("status", false);
		expect(res.body).toHaveProperty(
			"message",
			"Booking Cancelled Successfully"
		);
	});

	it("should return 404 if booking doesn't exist", async () => {
		const fakeBookingId = "64b7f9f2f2f2f2f2f2f2f2f2";
		const res = await request(app)
			.patch(`/user/booking/${fakeBookingId}`)
			.set("Authorization", `Bearer ${userToken}`);

		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty("error", "Booking does not exist");
	});

	it("should return 404 if booking is already cancelled", async () => {
		await request(app)
			.patch(`/user/booking/${bookingId}`)
			.set("Authorization", `Bearer ${userToken}`);

		const res = await request(app)
			.patch(`/user/booking/${bookingId}`)
			.set("Authorization", `Bearer ${userToken}`);

		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty("error", "Booking does not exist");
	});

	it("should return 401 if no user token is provided", async () => {
		const res = await request(app).patch(`/user/booking/${bookingId}`);

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: Authorization header is missing or invalid"
		);
	});

	it("should return 401 if user token is invalid", async () => {
		const res = await request(app)
			.patch(`/user/booking/${bookingId}`)
			.set("Authorization", "Bearer invalidtoken");

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty(
			"message",
			"Authentication failed: jwt malformed"
		);
	});

	it("should free up the seat when booking is cancelled", async () => {
		const userRes2 = await request(app).post("/user/register").send({
			username: "user2",
			email: "user2@example.com",
			password: "password123",
		});
		const userToken2 = userRes2.body.accessToken;
		const userId2 = userRes2.body.user._id;

		await request(app)
			.post("/user/booking")
			.set("Authorization", `Bearer ${userToken2}`)
			.send({
				eventId,
				userId: userId2,
				userDetails: {
					fullName: "User 2",
					email: "user2@example.com",
					phoneNumber: "+1234567891",
				},
			});

		const eventBefore = await request(app)
			.get(`/admin/event/${eventId}`)
			.set("Authorization", `Bearer ${adminToken}`);
		const bookedSeatsBefore =
			eventBefore.body.event.totalSeats - eventBefore.body.event.availableSeats;

		await request(app)
			.patch(`/user/booking/${bookingId}`)
			.set("Authorization", `Bearer ${userToken}`);

		const eventAfter = await request(app)
			.get(`/admin/event/${eventId}`)
			.set("Authorization", `Bearer ${adminToken}`);
		const bookedSeatsAfter =
			eventAfter.body.event.totalSeats - eventAfter.body.event.availableSeats;

		expect(bookedSeatsAfter).toBe(bookedSeatsBefore - 1);
	});
});
