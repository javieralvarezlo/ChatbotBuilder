import { fail, redirect, type ServerLoad } from "@sveltejs/kit";

import type { Actions } from "../$types";
import { getUserByEmail } from "$lib/services/users";
import { createSession, createSessionCookie, verifyPassword } from "$lib/services/auth";
import { createUserFolder, dirExists } from "$lib/server/fs";
import { emailToPath } from "$lib/services/utils";

export const load: ServerLoad = async ({ locals }) => {
    if(locals.user) {
		redirect(302, "/")
	}
}

export const actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get("email")?.toString() || "";
		const password = formData.get("password")?.toString() || "";

		const existingUser = await getUserByEmail(email);

		if (!existingUser) {
			return fail(400, { email, incorrect: true });
		}

		const validPassword = await verifyPassword(password, existingUser.hashed_password)
		if (!validPassword) {
			return fail(400, { email, incorrect: true });
		}

		if(!dirExists(`/data/${emailToPath(email)}`)) {
			createUserFolder(`${emailToPath(email)}`);
		}

		const session = await createSession(existingUser.id)
		const sessionCookie = createSessionCookie(session.id)
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});

		redirect(302, "/bots");
	}
} satisfies Actions;