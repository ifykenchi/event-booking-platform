import request from "supertest";
import app from "../../src/app";
import mongoose from "mongoose";
import TokenUtil from "../../src/utilities/token.util";

describe("AdminService - register", () => {
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
	});

	it("should return 400 if required fields are missing", async () => {
		const res = await request(app).post("/admin/register").send({
			email: "admin@example.com",
		});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error");
	});

	it("should return 400 for invalid email format", async () => {
		const res = await request(app).post("/admin/register").send({
			username: "collins",
			email: "invalid-email",
			password: "password123",
		});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error");
	});
});

describe("AdminService - login", () => {
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
	});

	it("should return 400 if required fields are missing", async () => {
		const res = await request(app).post("/admin/login").send({
			email: "admin2@example.com",
		});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error");
	});

	it("should return 400 for invalid email format", async () => {
		const res = await request(app).post("/admin/login").send({
			email: "invalid-email",
			password: "password123",
		});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error");
	});
});

describe("AdminService - getAdmin", () => {
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

describe("AdminService - addEvent", () => {
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
	});
});

describe("AdminService - getAllEvents", () => {
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

describe("AdminService - getEvent", () => {
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

describe("AdminService - editEvent", () => {
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

describe("AdminService - searchEvents", () => {
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
