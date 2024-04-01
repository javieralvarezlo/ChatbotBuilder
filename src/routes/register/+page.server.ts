import { lucia } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import { generateId } from "lucia";

import type { Actions } from "../$types";
import { createUser } from "$lib/services/users";
import { createSession, createSessionCookie, hashPassword } from "$lib/services/auth";
import { validEmail, validName, validPassword } from "$lib/services/validate";

export const actions: Actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const name = formData.get("name")?.toString() || "";
        const email = formData.get("email")?.toString() || "";
        const password = formData.get("password")?.toString() || "";
        const password2 = formData.get("password2")?.toString() || "";
        console.log(password, password2)
        let errors = {
            email,
            name,
            invalid_name: false,
            invalid_email: false,
            invalid_password: false,
            repeat: false,
        }

        if (!validEmail(email)) {
            errors.invalid_email = true;
        }
        
        if (!validName(name)) {
            errors.invalid_name = true;
        }

        if (!validPassword(password)) {
            errors.invalid_password = true;
        }

        if(password !== password2) {
            errors.repeat = true
        }

        if(errors.invalid_email || errors.invalid_name || errors.invalid_password || errors.repeat) {
            return fail(400, errors);
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