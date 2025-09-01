import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";

jest.setTimeout(60000);
let replSet: MongoMemoryReplSet;

beforeAll(async () => {
	replSet = await MongoMemoryReplSet.create({
		replSet: { count: 1 },
		instanceOpts: [
			{
				storageEngine: "wiredTiger",
				launchTimeout: 30000,
			},
		],
	});

	const uri = replSet.getUri();
	console.log(`Replica Set running on: ${uri}`);

	await mongoose.connect(uri, {
		replicaSet: "testset",
		directConnection: true,
	});

	await new Promise((resolve) => setTimeout(resolve, 1000));
});

afterAll(async () => {
	await mongoose.connection.close();
	await replSet.stop();
});

afterEach(async () => {
	const collections = await mongoose.connection.db!.collections();
	for (let collection of collections) {
		await collection.deleteMany({});
	}
});
