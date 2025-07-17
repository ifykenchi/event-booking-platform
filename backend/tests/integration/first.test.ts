import mongoose from "mongoose";

it("should connect to in-memory MongoDB and perform a simple write/read", async () => {
	const TestSchema = new mongoose.Schema({ name: String });
	const TestModel = mongoose.model("Test", TestSchema);

	const doc = await TestModel.create({ name: "memory-server-test" });

	const found = await TestModel.findOne({ name: "memory-server-test" });

	expect(found).not.toBeNull();
	expect(found!.name).toBe("memory-server-test");
});
