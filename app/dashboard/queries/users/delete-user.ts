import { getAuthFromRequest } from "~/auth";

export async function deleteUser({ token, id }: { token: string; id: number }) {
	let authToken = token;

	let response = await fetch(`${process.env.SERVER_URL}/users/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
	});

	return response;
}
