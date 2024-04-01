import { fail, redirect } from "@sveltejs/kit";

import type { Actions } from "../$types";
import { getUserByEmail } from "$lib/services/users";
import { createSession, createSessionCookie, verifyPassword } from "$lib/services/auth";

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get("email");
		const password = formData.get("password");

		if (
			typeof email !== "string" ||
			email.length < 3 ||
			email.length > 31 ||
			!/^[a-z0-9_-]+$/.test(email)
		) {
			return fail(400, {
				message: "Invalid username"
			});
		}
		if (typeof password !== "string" || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: "Invalid password"
			});
		}

		const existingUser = await getUserByEmail(email);
		if (!existingUser) {
			return fail(400, {
				message: "Incorrect username or password"
			});
		}

		const validPassword = await verifyPassword(password, existingUser.hashed_password)
		if (!validPassword) {
			return fail(400, {
				message: "Incorrect username or password"
			});
		}

		const session = await createSession(existingUser.id)
		const sessionCookie = createSessionCookie(session.id)
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});

		redirect(302, "/");
	}
};