import app from "./app";
import { dbConfig } from "./models/_config";

const port = process.env.PORT || 8082;

dbConfig();

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
