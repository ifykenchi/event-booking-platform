import SchemaValidator from "../../../src/validations/register.validator";

describe("SchemaValidator", () => {
	describe("register", () => {
		const schema = SchemaValidator.register;

		it("should validate a correct registration payload", () => {
			const payload = {
				username: "testuser",
				email: "test@example.com",
				password: "password123",
			};
			const { error, value } = schema.validate(payload);
			expect(error).toBeUndefined();
			expect(value).toMatchObject(payload);
		});

		it("should fail if username is too short", () => {
			const payload = {
				username: "ab",
				email: "test@example.com",
				password: "password123",
			};
			const { error } = schema.validate(payload);
			expect(error).toBeDefined();
			expect(error?.details[0].message).toMatch(/username/);
		});

		it("should fail if username is too long", () => {
			const payload = {
				username: "abeyeyeyeyeyeyeyeyeyeyeyeyeyeyeye",
				email: "test@example.com",
				password: "password123",
			};
			const { error } = schema.validate(payload);
			expect(error).toBeDefined();
			expect(error?.details[0].message).toMatch(/username/);
		});

		it("should fail if email is invalid", () => {
			const payload = {
				username: "testuser",
				email: "not-an-email",
				password: "password123",
			};
			const { error } = schema.validate(payload);
			expect(error).toBeDefined();
			expect(error?.details[0].message).toMatch(/email/);
		});

		it("should fail if password is too short", () => {
			const payload = {
				username: "testuser",
				email: "test@example.com",
				password: "123",
			};
			const { error } = schema.validate(payload);
			expect(error).toBeDefined();
			expect(error?.details[0].message).toMatch(/password/);
		});

		it("should fail if password is too long", () => {
			const payload = {
				username: "testuser",
				email: "test@example.com",
				password: "1233434343434343434343434343434343",
			};
			const { error } = schema.validate(payload);
			expect(error).toBeDefined();
			expect(error?.details[0].message).toMatch(/password/);
		});
	});

	describe("login", () => {
		const schema = SchemaValidator.login;

		it("should validate a correct login payload", () => {
			const payload = {
				email: "test@example.com",
				password: "password123",
			};
			const { error, value } = schema.validate(payload);
			expect(error).toBeUndefined();
			expect(value).toMatchObject(payload);
		});

		it("should fail if email is missing", () => {
			const payload = {
				password: "password123",
			};
			const { error } = schema.validate(payload);
			expect(error).toBeDefined();
			expect(error?.details[0].message).toMatch(/email/);
		});

		it("should fail if password is missing", () => {
			const payload = {
				email: "test@example.com",
			};
			const { error } = schema.validate(payload);
			expect(error).toBeDefined();
			expect(error?.details[0].message).toMatch(/password/);
		});
	});

	describe("validEvent", () => {
		const schema = SchemaValidator.validEvent;

		it("should validate a correct event payload", () => {
			const payload = {
				title: "Event Title",
				about: "This is a test event.",
				totalSeats: 100,
				category: "Music",
				price: 50,
				createdOn: new Date(),
			};
			const { error, value } = schema.validate(payload);
			expect(error).toBeUndefined();
			expect(value.title).toBe("Event Title");
		});

		it("should fail if title is too short", () => {
			const payload = {
				title: "Ev",
				about: "This is a test event.",
				totalSeats: 100,
				category: "Music",
				price: 50,
				createdOn: new Date(),
			};
			const { error } = schema.validate(payload);
			expect(error).toBeDefined();
			expect(error?.details[0].message).toMatch(/title/);
		});

		it("should fail if title is missing", () => {
			const payload = {
				about: "This is a test event.",
				totalSeats: 100,
				category: "Music",
				price: 50,
				createdOn: new Date(),
			};
			const { error } = schema.validate(payload);
			expect(error).toBeDefined();
			expect(error?.details[0].message).toMatch(/title/);
		});

		it("should fail if about is missing", () => {
			const payload = {
				title: "Event Title",
				totalSeats: 100,
				category: "Music",
				price: 50,
				createdOn: new Date(),
			};
			const { error } = schema.validate(payload);
			expect(error).toBeDefined();
			expect(error?.details[0].message).toMatch(/about/);
		});

		it("should fail if totalSeats is missing", () => {
			const payload = {
				title: "Event Title",
				about: "This is a test event.",
				category: "Music",
				price: 50,
				createdOn: new Date(),
			};
			const { error } = schema.validate(payload);
			expect(error).toBeDefined();
			expect(error?.details[0].message).toMatch(/totalSeats/);
		});

		it("should fail if category is missing", () => {
			const payload = {
				title: "Event Title",
				about: "This is a test event.",
				totalSeats: 100,
				price: 50,
				createdOn: new Date(),
			};
			const { error } = schema.validate(payload);
			expect(error).toBeDefined();
			expect(error?.details[0].message).toMatch(/category/);
		});

		it("should fail if price is missing", () => {
			const payload = {
				title: "Event Title",
				about: "This is a test event.",
				totalSeats: 100,
				category: "Music",
				createdOn: new Date(),
			};
			const { error } = schema.validate(payload);
			expect(error).toBeDefined();
			expect(error?.details[0].message).toMatch(/price/);
		});

		it("should fail if totalSeats is negative", () => {
			const payload = {
				title: "Event Title",
				about: "This is a test event.",
				totalSeats: -1,
				category: "Music",
				price: 50,
				createdOn: new Date(),
			};
			const { error } = schema.validate(payload);
			expect(error).toBeDefined();
			expect(error?.details[0].message).toMatch(/totalSeats/);
		});
	});

	describe("editEvent", () => {
		const schema = SchemaValidator.editEvent;

		it("should validate a correct edit event payload", () => {
			const payload = {
				_id: "eventid",
				title: "New Title",
				about: "Updated about",
				totalSeats: 200,
				category: "Art",
				price: 100,
				createdOn: new Date(),
			};
			const { error, value } = schema.validate(payload);
			expect(error).toBeUndefined();
			expect(value.title).toBe("New Title");
		});

		it("should allow partial payload", () => {
			const payload = {
				title: "Partial Title",
			};
			const { error, value } = schema.validate(payload);
			expect(error).toBeUndefined();
			expect(value.title).toBe("Partial Title");
		});

		it("should fail if price is negative", () => {
			const payload = {
				price: -10,
			};
			const { error } = schema.validate(payload);
			expect(error).toBeDefined();
			expect(error?.details[0].message).toMatch(/price/);
		});
	});
});
