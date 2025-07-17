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
