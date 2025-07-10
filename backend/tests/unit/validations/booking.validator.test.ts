import BookingSchemaValidator from "../../../src/validations/booking.validator";

describe("BookingSchemaValidator", () => {
	const schema = BookingSchemaValidator.createBooking;

	it("should validate a correct booking payload", () => {
		const payload = {
			eventId: "5f8f8c44b54764421b7156c1",
			userId: "5f8f8c44b54764421b7156c2",
			userDetails: {
				fullName: "John Doe",
				email: "john@example.com",
				phoneNumber: "+1234567890",
			},
			status: true,
			createdOn: new Date(),
		};

		const { error, value } = schema.validate(payload);
		expect(error).toBeUndefined();
		expect(value).toMatchObject(payload);
	});

	it("should fail if eventId is missing", () => {
		const payload = {
			userId: "5f8f8c44b54764421b7156c2",
			userDetails: {
				fullName: "John Doe",
				email: "john@example.com",
				phoneNumber: "+1234567890",
			},
			status: true,
			createdOn: new Date(),
		};
		const { error } = schema.validate(payload);
		expect(error).toBeDefined();
		expect(error?.details[0].message).toMatch(/eventId/);
	});

	it("should fail if userId is missing", () => {
		const payload = {
			eventId: "5f8f8c44b54764421b7156c2",
			userDetails: {
				fullName: "John Doe",
				email: "john@example.com",
				phoneNumber: "+1234567890",
			},
			status: true,
			createdOn: new Date(),
		};
		const { error } = schema.validate(payload);
		expect(error).toBeDefined();
		expect(error?.details[0].message).toMatch(/userId/);
	});

	it("should fail if fullName is missing", () => {
		const payload = {
			eventId: "5f8f8c44b54764421b7156c1",
			userId: "5f8f8c44b54764421b7156c2",
			userDetails: {
				email: "john@example.com",
				phoneNumber: "+1234567890",
			},
			status: true,
			createdOn: new Date(),
		};
		const { error } = schema.validate(payload);
		expect(error).toBeDefined();
		expect(error?.details[0].message).toMatch(/fullName/);
	});

	it("should fail if email is missing", () => {
		const payload = {
			eventId: "5f8f8c44b54764421b7156c1",
			userId: "5f8f8c44b54764421b7156c2",
			userDetails: {
				fullName: "charles gip",
				phoneNumber: "+1234567890",
			},
			status: true,
			createdOn: new Date(),
		};
		const { error } = schema.validate(payload);
		expect(error).toBeDefined();
		expect(error?.details[0].message).toMatch(/email/);
	});

	it("should fail if phoneNumber is missing", () => {
		const payload = {
			eventId: "5f8f8c44b54764421b7156c1",
			userId: "5f8f8c44b54764421b7156c2",
			userDetails: {
				fullName: "charles gip",
				email: "benny@gmail.com",
			},
			status: true,
			createdOn: new Date(),
		};
		const { error } = schema.validate(payload);
		expect(error).toBeDefined();
		expect(error?.details[0].message).toMatch(/phoneNumber/);
	});

	it("should fail if eventId is not a valid hex string", () => {
		const payload = {
			eventId: "invalid",
			userId: "5f8f8c44b54764421b7156c2",
			userDetails: {
				fullName: "John Doe",
				email: "john@example.com",
				phoneNumber: "+1234567890",
			},
		};

		const { error } = schema.validate(payload);
		expect(error).toBeDefined();
		expect(error?.details[0].message).toMatch(
			/Event ID must be valid hexadecimal/
		);
	});

	it("should fail if eventId is not 24 characters", () => {
		const payload = {
			eventId: "123",
			userId: "5f8f8c44b54764421b7156c2",
			userDetails: {
				fullName: "John Doe",
				email: "john@example.com",
				phoneNumber: "+1234567890",
			},
		};

		const { error } = schema.validate(payload);
		expect(error).toBeDefined();
		expect(error?.details[0].message).toMatch(
			/Event ID must be 24 characters long/
		);
	});

	it("should fail if userId is not a valid hex string", () => {
		const payload = {
			eventId: "5f8f8c44b54764421b7156c2",
			userId: "invalid",
			userDetails: {
				fullName: "John Doe",
				email: "john@example.com",
				phoneNumber: "+1234567890",
			},
		};

		const { error } = schema.validate(payload);
		expect(error).toBeDefined();
		expect(error?.details[0].message).toMatch(
			/User ID must be valid hexadecimal/
		);
	});

	it("should fail if userId is not 24 characters", () => {
		const payload = {
			eventId: "5f8f8c44b54764421b7156c1",
			userId: "123",
			userDetails: {
				fullName: "John Doe",
				email: "john@example.com",
				phoneNumber: "+1234567890",
			},
		};

		const { error } = schema.validate(payload);
		expect(error).toBeDefined();
		expect(error?.details[0].message).toMatch(
			/User ID must be 24 characters long/
		);
	});

	it("should fail if userDetails.fullName is too short", () => {
		const payload = {
			eventId: "5f8f8c44b54764421b7156c1",
			userId: "5f8f8c44b54764421b7156c2",
			userDetails: {
				fullName: "Jo",
				email: "john@example.com",
				phoneNumber: "+1234567890",
			},
		};

		const { error } = schema.validate(payload);
		expect(error).toBeDefined();
		expect(error?.details[0].message).toMatch(/fullName/);
	});

	it("should fail if userDetails.email is invalid", () => {
		const payload = {
			eventId: "5f8f8c44b54764421b7156c1",
			userId: "5f8f8c44b54764421b7156c2",
			userDetails: {
				fullName: "John Doe",
				email: "not-an-email",
				phoneNumber: "+1234567890",
			},
		};

		const { error } = schema.validate(payload);
		expect(error).toBeDefined();
		expect(error?.details[0].message).toMatch(/email/);
	});

	it("should fail if userDetails.phoneNumber is invalid", () => {
		const payload = {
			eventId: "5f8f8c44b54764421b7156c1",
			userId: "5f8f8c44b54764421b7156c2",
			userDetails: {
				fullName: "John Doe",
				email: "john@example.com",
				phoneNumber: "abc",
			},
		};

		const { error } = schema.validate(payload);
		expect(error).toBeDefined();
		expect(error?.details[0].message).toMatch(/phoneNumber/);
	});

	it("should allow missing optional fields (status, createdOn)", () => {
		const payload = {
			eventId: "5f8f8c44b54764421b7156c1",
			userId: "5f8f8c44b54764421b7156c2",
			userDetails: {
				fullName: "John Doe",
				email: "john@example.com",
				phoneNumber: "+1234567890",
			},
		};

		const { error, value } = schema.validate(payload);
		expect(error).toBeUndefined();
		expect(value).toMatchObject(payload);
	});
});
