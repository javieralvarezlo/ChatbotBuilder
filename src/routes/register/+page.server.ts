import { lucia } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import { generateId } from "lucia";

import type { Actions } from "../$types";
import { createUser } from "$lib/services/users";
import { createSession, createSessionCookie, hashPassword } from "$lib/services/auth";

export const actions: Actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const name = formData.get("name")?.toString();
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

        if (typeof name !== "string" || name?.length === 0) {
            return fail(400, {
                message: "Invalid name"
            });
        }
        if (typeof password !== "string" || password.length < 6 || password.length > 255) {
            return fail(400, {
                message: "Invalid password"
            });
        }

        const userId = generateId(15);
        const hashedPassword = await hashPassword(password);       

        await createUser(userId, name, email, hashedPassword);

        const session = await createSession(userId);
        const sessionCookie = createSessionCookie(session.id);
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path: ".",
            ...sessionCookie.attributes
        });

        redirect(302, "/");
    }
};