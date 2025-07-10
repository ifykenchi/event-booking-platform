import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import * as joi from "joi";
import newJoi, {
	Joi as JoiClass,
} from "../../../src/middlewares/validator.midware";

describe("Joi Middleware", () => {
	let app: express.Express;

	beforeEach(() => {
		app = express();
		app.use(express.json());
	});

	it("should call next() if validation passes", async () => {
		const schema = joi.object({
			name: joi.string().required(),
		});

		const handler = jest.fn((req: Request, res: Response) =>
			res.status(200).json({ ok: true })
		) as any;

		app.post("/test", newJoi.vdtor(schema), handler);

		const res = await request(app).post("/test").send({ name: "John" });

		expect(res.status).toBe(200);
		expect(res.body).toEqual({ ok: true });
		expect(handler).toHaveBeenCalled();
	});

	it("should return 400 if validation fails", async () => {
		const schema = joi.object({
			name: joi.string().required(),
		});

		app.post(
			"/test",
			newJoi.vdtor(schema),
			(req, res) => res.status(200).json({ ok: true }) as any
		);

		const res = await request(app).post("/test").send({});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error", true);
		expect(res.body).toHaveProperty("message");
		expect(res.body.message).toMatch(/name/);
	});

	it("should validate query if field is set to 'query'", async () => {
		const schema = joi.object({
			age: joi.number().required(),
		});

		const handler = jest.fn((req: Request, res: Response) =>
			res.status(200).json({ ok: true })
		) as any;

		app.get("/test", newJoi.vdtor(schema, "query"), handler);

		const res = await request(app).get("/test").query({ age: 25 });

		expect(res.status).toBe(200);
		expect(res.body).toEqual({ ok: true });
		expect(handler).toHaveBeenCalled();
	});

	it("should return 400 if query validation fails", async () => {
		const schema = joi.object({
			age: joi.number().required(),
		});

		app.get(
			"/test",
			newJoi.vdtor(schema, "query"),
			(req, res) => res.status(200).json({ ok: true }) as any
		);

		const res = await request(app).get("/test").query({});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error", true);
		expect(res.body).toHaveProperty("message");
		expect(res.body.message).toMatch(/age/);
	});
});
