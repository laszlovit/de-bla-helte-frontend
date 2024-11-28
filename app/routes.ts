import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),

	route("login", "auth/routes/login.tsx"),
	route("logout", "auth/routes/logout.ts"),

	route("dashboard", "dashboard/routes/dashboard-layout.tsx", [
		index("dashboard/routes/dashboard.tsx"),
		route("services", "dashboard/routes/dashboard-services.tsx"),
		route("users", "dashboard/routes/dashboard-users.tsx"),
	]),
] satisfies RouteConfig;
