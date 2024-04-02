import { fail, redirect, type ServerLoad } from "@sveltejs/kit";

import { botsWithDescription, createBot, deleteBot, foldersIn, userHasBot } from "$lib/server/fs";
import type { Actions } from "./$types";
import { emailToPath } from "$lib/services/utils";

export const load: ServerLoad = async ({ locals }) => {
    const data = botsWithDescription(emailToPath(locals.user?.email))
    return {
        bots: data.bots,
        botStrings: data.botStrings
    }
}

export const actions = {
    create: async (event) => {
        const formData = await event.request.formData();
        const name = formData.get("name")?.toString() || "";
        const description = formData.get("description")?.toString() || "";

        if (userHasBot(emailToPath(event.locals.user?.email), name)) {
            return fail(400, { name, description, exist: true })
        }
        createBot(emailToPath(event.locals.user?.email), name, description);
        return { create: true }
    },

    delete: async (event) => {
        const formData = await event.request.formData();
        const bot = formData.get("bot")?.toString() || "";
        deleteBot(emailToPath(event.locals.user?.email), bot);
        return { delete: true }
    }
} satisfies Actions;