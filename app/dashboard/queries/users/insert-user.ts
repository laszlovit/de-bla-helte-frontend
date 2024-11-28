export async function insertUser({
	token,
	name,
	email,
	password,
	role_name,
}: {
	token: string;
	name: string;
	email: string;
	password: string;
	role_name: string;
}) {
	let authToken = token;

	let response = await fetch(`${process.env.SERVER_URL}/users`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
		body: JSON.stringify({
			name,
			email,
			password,
			role_name,
		}),
	});

	return response;
}
