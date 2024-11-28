export async function login({ email, password }: { email: string; password: string }) {
	let response = await fetch(`${process.env.SERVER_URL}/tokens/authentication`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email, password }),
	});

	let data = await response.json();
	let token = data.authentication_token.token;

	return token;
}
