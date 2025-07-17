import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

jest.setTimeout(30000);

let mongo: MongoMemoryServer;

beforeAll(async () => {
	mongo = await MongoMemoryServer.create();
	const uri = mongo.getUri();
	console.log(`DB running on port: ${uri}`);
	await mongoose.connect(uri);
});

afterAll(async () => {
	await mongoose.connection.close();
	await mongo.stop();
});

afterEach(async () => {
	const collections = await mongoose.connection.db!.collections();
	for (let collection of collections) {
		await collection.deleteMany({});
	}
});
