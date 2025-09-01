import mongoose from "mongoose";

it("should connect to in-memory MongoDB and perform a simple write/read", async () => {
	const TestSchema = new mongoose.Schema({ name: String });
	const TestModel = mongoose.model("Test", TestSchema);

	const doc = await TestModel.create({ name: "memory-server-test" });

	const found = await TestModel.findOne({ name: "memory-server-test" });

	expect(found).not.toBeNull();
	expect(found!.name).toBe("memory-server-test");
});

// import mongoose from "mongoose";
// import { MongoMemoryServer } from "mongodb-memory-server";

// jest.setTimeout(30000);

// let mongo: MongoMemoryServer;

// beforeAll(async () => {
// 	mongo = await MongoMemoryServer.create();
// 	const uri = mongo.getUri();
// 	console.log(`DB running on port: ${uri}`);
// 	await mongoose.connect(uri);
// });

// afterAll(async () => {
// 	await mongoose.connection.close();
// 	await mongo.stop();
// });

// afterEach(async () => {
// 	const collections = await mongoose.connection.db!.collections();
// 	for (let collection of collections) {
// 		await collection.deleteMany({});
// 	}
// });
