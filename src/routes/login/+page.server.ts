import { fail, redirect } from "@sveltejs/kit";

import type { Actions } from "../$types";
import { getUserByEmail } from "$lib/services/users";
import { createSession, createSessionCookie, verifyPassword } from "$lib/services/auth";

export const actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get("email")?.toString() || "";
		const password = formData.get("password")?.toString() || "";

		const existingUser = await getUserByEmail(email);

		if (!existingUser) {
			console.log(1)
			return fail(400, { email, incorrect: true });
		}

		const validPassword = await verifyPassword(password, existingUser.hashed_password)
		if (!validPassword) {
			console.log(2)
			return fail(400, { email, incorrect: true });
		}

		const session = await createSession(existingUser.id)
		const sessionCookie = createSessionCookie(session.id)
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});

		redirect(302, "/");
	}
} satisfies Actions;