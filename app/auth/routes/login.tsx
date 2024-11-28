import { Link } from "~/components/ui/link";
import { Route } from "./+types/login";
import { Form, redirect } from "react-router";
import { redirectIfLoggedInLoader, setAuthOnResponse } from "~/auth";
import { login } from "~/auth/queries/login";

export const loader = redirectIfLoggedInLoader;

export async function action({ request }: Route.ClientActionArgs) {
	let formData = await request.formData();
	let email = String(formData.get("email") || "");
	let password = String(formData.get("password") || "");

	let token = await login({ email, password });

	let response = redirect("/dashboard");

	return setAuthOnResponse(response, token);
}

export default function Login({}: Route.ComponentProps) {
	return (
		<>
			<main className="bg-gray-50">
				<div className="flex min-h-dvh items-center justify-center p-6 lg:p-8">
					<div className="w-full max-w-md rounded-xl bg-white shadow-md ring-1 ring-black/5">
						<Form method="post" className="p-7 sm:p-11">
							<div className="flex items-start">
								<Link title="Home" data-headlessui-state="" href="/">
									<p className="text-primary text-xl font-semibold">De Blå Helte</p>
								</Link>
							</div>
							<h1 className="mt-8 text-base/6 font-medium">Welcome back!</h1>
							<p className="mt-1 text-sm/5 text-gray-600">Sign in to your account to continue.</p>
							<div className="mt-8 space-y-3">
								<label className="text-sm/5 font-medium">Email</label>
								<input
									type="email"
									name="email"
									className="block w-full rounded-lg border border-transparent px-[calc(theme(spacing.2)-1px)] py-[calc(theme(spacing[1.5])-1px)] text-base/6 shadow ring-1 ring-black/10 data-[focus]:outline data-[focus]:outline-2 data-[focus]:-outline-offset-1 data-[focus]:outline-black sm:text-sm/6"
								/>
							</div>
							<div className="mt-8 space-y-3">
								<label className="text-sm/5 font-medium">Password</label>
								<input
									type="password"
									name="password"
									className="block w-full rounded-lg border border-transparent px-[calc(theme(spacing.2)-1px)] py-[calc(theme(spacing[1.5])-1px)] text-base/6 shadow ring-1 ring-black/10 data-[focus]:outline data-[focus]:outline-2 data-[focus]:-outline-offset-1 data-[focus]:outline-black sm:text-sm/6"
								/>
							</div>
							<div className="mt-8">
								<button
									type="submit"
									className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-full border border-transparent bg-gray-950 px-4 py-[calc(theme(spacing.2)-1px)] text-base font-medium text-white shadow-md data-[disabled]:bg-gray-950 data-[hover]:bg-gray-800 data-[disabled]:opacity-40"
									data-headlessui-state=""
								>
									Sign in
								</button>
							</div>
						</Form>
					</div>
				</div>
			</main>
		</>
	);
}
