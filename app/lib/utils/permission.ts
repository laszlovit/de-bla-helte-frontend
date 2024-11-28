import { User } from "~/lib/types";

export function hasPermission(user: User, permission: string): boolean {
	return user.permissions.includes(permission) || user.permissions.includes("*");
}
