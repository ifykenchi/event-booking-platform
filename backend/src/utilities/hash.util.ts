import bcrypt from "bcrypt";

export async function hash(password: string): Promise<string> {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
}

export async function isMatch(
	reqPassword: string,
	userPassword: string
): Promise<boolean> {
	return await bcrypt.compare(reqPassword, userPassword);
}
