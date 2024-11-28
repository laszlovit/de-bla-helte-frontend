export type User = {
	id: number;
	name: string;
	email: string;
	role_name: string;
	permissions: string[];
};

export const INTENTS = {
	insertUser: "insertUser" as const,
	updateUser: "updateUser" as const,
	deleteUser: "deleteUser" as const,
};
