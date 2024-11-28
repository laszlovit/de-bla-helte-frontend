import { getAuthFromRequest } from "~/auth";

export async function getAllUsers({ request }: { request: Request }) {
	const authToken = await getAuthFromRequest(request);
	let response = await fetch(`${process.env.SERVER_URL}/users`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
	});

	let data = await response.json();

	return data;
}
