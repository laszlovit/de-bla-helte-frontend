import { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Dashboard | De Blå Helte" },
		{ name: "description", content: "Welcome to the dashboard" },
	];
}

export default function Dashboard() {
	return <h1>Dashboard</h1>;
}
