import { ActionFunctionArgs, Form, LoaderFunctionArgs, useLoaderData } from "react-router";
import { getAllUsers } from "../queries/users/get-all-users";
import { Heading } from "~/components/ui/heading";
import { Input, InputGroup } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { Badge, BadgeProps } from "~/components/ui/badge";
import { EllipsisVerticalIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { getCurrentUser } from "~/dashboard/queries/users/get-current-user";
import { hasPermission } from "~/lib/utils/permission";
import { Button } from "~/components/ui/button";
import { INTENTS, User } from "~/lib/types";
import {
	Dialog,
	DialogActions,
	DialogBody,
	DialogDescription,
	DialogTitle,
} from "~/components/ui/dialog";
import { Field, FieldGroup, Fieldset, Label } from "~/components/ui/fieldset";
import { useState } from "react";
import { requireAuthCookie } from "~/auth";
import { insertUser } from "../queries/users/insert-user";
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from "~/components/ui/dropdown";
import { Alert, AlertTitle, AlertDescription, AlertActions } from "~/components/ui/alert";
import { deleteUser } from "../queries/users/delete-user";
import { badRequest } from "~/http/bad-request";
import { updateUser } from "../queries/users/update-user";

export async function loader({ request }: LoaderFunctionArgs) {
	const currentUser = await getCurrentUser({ request });
	const usersData = await getAllUsers({ request });

	return { currentUser, usersData };
}

export async function action({ request }: ActionFunctionArgs) {
	let token = await requireAuthCookie(request);

	let formData = await request.formData();

	let intent = String(formData.get("intent"));
	switch (intent) {
		case INTENTS.insertUser: {
			let name = String(formData.get("name") || "");
			let email = String(formData.get("email") || "");
			let password = String(formData.get("password") || "");
			let role_name = String(formData.get("role_name") || "");
			await insertUser({ token, name, email, password, role_name });
			return { ok: true };
		}
		case INTENTS.updateUser: {
			let userId = formData.get("userId");
			let name = String(formData.get("name") || "");
			let role_name = String(formData.get("role_name") || "");
			await updateUser({ token, id: Number(userId), name, role_name });
			return { ok: true };
		}
		case INTENTS.deleteUser: {
			let userId = formData.get("userId");
			if (!userId) throw badRequest("Missing userId");
			await deleteUser({ token, id: Number(userId) });
			return { ok: true };
		}
		default: {
			throw badRequest(`Unknown intent: ${intent}`);
		}
	}
}

function TableDropDown({ id, name, role }: { id: number; name: string; role: string }) {
	let [isDeleteUserOpen, setIsDeletUserDownOpen] = useState(false);
	let [isUpdateUserOpen, setIsUpdateUserOpen] = useState(false);
	let [isUpdatePasswordOpen, setIsUpdatePasswordOpen] = useState(false);

	return (
		<>
			<Dropdown>
				<DropdownButton plain aria-label="More options">
					<EllipsisVerticalIcon />
				</DropdownButton>
				<DropdownMenu anchor="bottom end">
					<DropdownItem onClick={() => setIsUpdateUserOpen(true)}>Edit</DropdownItem>
					<DropdownItem onClick={() => setIsDeletUserDownOpen(true)}>Delete</DropdownItem>
					<DropdownItem onClick={() => setIsUpdatePasswordOpen(true)}>Reset password</DropdownItem>
				</DropdownMenu>
			</Dropdown>
			<Alert open={isDeleteUserOpen} onClose={setIsDeletUserDownOpen}>
				<AlertTitle>Are you sure you want to delete this user?</AlertTitle>
				<AlertDescription>
					This is a permanent action and cannot be undone. Please be sure before proceeding.
				</AlertDescription>
				<AlertActions>
					<form method="post">
						<input type="hidden" name="intent" value={INTENTS.deleteUser} />
						<input type="hidden" name="userId" value={id} />
						<Button color="red" type="submit" onClick={() => setIsDeletUserDownOpen(false)}>
							Delete
						</Button>
					</form>
					<Button plain onClick={() => setIsDeletUserDownOpen(false)}>
						Cancel
					</Button>
				</AlertActions>
			</Alert>
			<Dialog open={isUpdateUserOpen} onClose={setIsUpdateUserOpen}>
				<Form method="patch">
					<DialogTitle>Update user</DialogTitle>
					<DialogDescription>
						Enter the user&apos;s name, email, and role to update a current user.
					</DialogDescription>
					<DialogBody>
						<FieldGroup>
							<input type="hidden" name="intent" value={INTENTS.updateUser} />
							<input type="hidden" name="userId" value={id} />
							<Field>
								<Label>Name</Label>
								<Input name="name" type="string" defaultValue={name} />
							</Field>

							<Field>
								<Label>Role</Label>
								<Select name="role_name" defaultValue={role}>
									<option value="editor">Editor</option>
									<option value="admin">Admin</option>
								</Select>
							</Field>
						</FieldGroup>
					</DialogBody>
					<DialogActions>
						<Button plain onClick={() => setIsUpdateUserOpen(false)}>
							Cancel
						</Button>
						<Button onClick={() => setIsUpdateUserOpen(false)} type="submit">
							Update
						</Button>
					</DialogActions>
				</Form>
			</Dialog>
			{/* <Dialog open={isUpdatePasswordOpen} onClose={setIsUpdatePasswordOpen}>
				<UpdateUserPasswordForm id={id}>
					<DialogActions>
						<Button plain onClick={() => setIsUpdatePasswordOpen(false)}>
							Cancel
						</Button>
						<Button onClick={() => setIsUpdatePasswordOpen(false)} type="submit">
							Update
						</Button>
					</DialogActions>
				</UpdateUserPasswordForm>
			</Dialog>  */}
		</>
	);
}

function InsertUserDialog() {
	let [isInsertModalOpen, setIsInsertModalOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setIsInsertModalOpen(true)}>Create user</Button>
			<Dialog open={isInsertModalOpen} onClose={setIsInsertModalOpen}>
				<form method="post">
					<DialogTitle>Create user</DialogTitle>
					<DialogDescription>
						Enter the user&apos;s name, email, and role to create a new user.
					</DialogDescription>
					<DialogBody>
						<FieldGroup>
							<input type="hidden" name="intent" value={INTENTS.insertUser} />
							<Field>
								<Label>Name</Label>
								<Input name="name" type="string" required />
							</Field>
							<Field>
								<Label>Email</Label>
								<Input name="email" type="email" required />
							</Field>
							<Field>
								<Label>Password</Label>
								<Input name="password" type="password" required />
							</Field>
							<Field>
								<Label>Role</Label>
								<Select name="role_name">
									<option value="editor">Editor</option>
									<option value="admin">Admin</option>
								</Select>
							</Field>
						</FieldGroup>
					</DialogBody>
					<DialogActions>
						<Button plain onClick={() => setIsInsertModalOpen(false)}>
							Cancel
						</Button>
						<Button onClick={() => setIsInsertModalOpen(false)} type="submit">
							Create
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</>
	);
}

export default function DashboardUsers() {
	const {
		currentUser,
		usersData: { metadata, users },
	} = useLoaderData<typeof loader>();

	const hasUsersWritePermission = currentUser && hasPermission(currentUser, "users:write");

	return (
		<>
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div className="max-sm:w-full sm:flex-1">
					<Heading>Users</Heading>
					<div className="mt-4 flex max-w-xl gap-4">
						<div className="flex-1">
							<InputGroup>
								<MagnifyingGlassIcon />
								<Input name="search" placeholder="Search users&hellip;" />
							</InputGroup>
						</div>
						<div>
							<Select name="sort_by">
								<option value="name">Sort by name</option>
								<option value="email">Sort by email</option>
								<option value="role">Sort by role</option>
							</Select>
						</div>
					</div>
				</div>
				{hasUsersWritePermission && <InsertUserDialog />}
			</div>
			<Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
				<TableHead>
					<TableRow>
						<TableHeader>Name</TableHeader>
						<TableHeader>Email</TableHeader>
						<TableHeader>Role</TableHeader>
						{hasUsersWritePermission && <TableHeader className="text-right">Actions</TableHeader>}
					</TableRow>
				</TableHead>
				<TableBody>
					{users.map((user: User) => {
						let badgeColor: BadgeProps["color"];
						switch (user.role_name) {
							case "admin":
								badgeColor = "red";
								break;
							case "editor":
								badgeColor = "blue";
								break;
							case "viewer":
								badgeColor = "green";
								break;
							default:
								badgeColor = "zinc";
								break;
						}
						return (
							<TableRow key={user.name} title={`User ${user.name}`}>
								<TableCell>{user.name}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>
									<Badge color={badgeColor}>{user.role_name}</Badge>
								</TableCell>
								{hasUsersWritePermission && (
									<TableCell className="text-right">
										<TableDropDown id={user.id} name={user.name} role={user.role_name} />
									</TableCell>
								)}
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</>
	);
}
