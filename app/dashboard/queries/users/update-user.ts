export async function updateUser({
	token,
	id,
	name,
	role_name,
}: {
	token: string;
	id: number;
	name: string;
	role_name: string;
}) {
	let authToken = token;

	await fetch(`${process.env.SERVER_URL}/users/${id}`, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
		body: JSON.stringify({
			name,
			role_name,
		}),
	});
}
