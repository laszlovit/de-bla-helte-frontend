import { createCookie, LoaderFunctionArgs, redirect } from "react-router";

export let authCookie = createCookie("auth", {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	path: "/",
	sameSite: "lax",
	maxAge: 30 * 24 * 60 * 60,
});

export async function getAuthFromRequest(request: Request): Promise<string | null> {
	let token = await authCookie.parse(request.headers.get("Cookie"));
	return token ?? null;
}

export async function setAuthOnResponse(response: Response, token: string): Promise<Response> {
	let header = await authCookie.serialize(token);
	response.headers.append("Set-Cookie", header);
	return response;
}

export async function requireAuthCookie(request: Request) {
	let token = await getAuthFromRequest(request);
	if (!token) {
		throw redirect("/login", {
			headers: {
				"Set-Cookie": await authCookie.serialize("", {
					maxAge: 0,
					path: "/",
				}),
			},
		});
	}
	return token;
}

export async function redirectIfLoggedInLoader({ request }: LoaderFunctionArgs) {
	let token = await getAuthFromRequest(request);
	if (token) {
		throw redirect("/dashboard");
	}
	return null;
}

export async function redirectWithClearedCookie(): Promise<Response> {
	return redirect("/login", {
		headers: {
			"Set-Cookie": await authCookie.serialize(null, {
				maxAge: 0,
				path: "/",
			}),
		},
	});
}
