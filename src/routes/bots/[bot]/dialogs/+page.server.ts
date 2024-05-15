import { createDialog, existsDialog, removeDialog, removeStories, saveIntents } from '$lib/server/rasa';
import { emailToPath } from '$lib/services/utils';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from "./$types";


export const load: PageServerLoad = async ({ locals, params, parent }) => {
    const { bot, nluFile, domainFile, botInfo } = await parent();

    let intents: { name: string; }[] = [];
    let responses: { name: string; }[] = [];

    nluFile.nlu.map((intent: { intent: string; }) => {
        intents.push({ name: intent.intent })
    })

    Object.keys(domainFile.responses).map(response => {
        responses.push({ name: response.split("utter_")[1] })
    })

    return {
        bot,
        intents,
        responses,
        botInfo
    }
}

export const actions = {
    save: async (event) => {
        const formData = await event.request.formData();
        const name = formData.get("name")
        const type = formData.get("type")

        if (!name) {
            return fail(422, {
                error: "Debes indicar nombre",
                name
            });
        }
        if (existsDialog(emailToPath(event.locals.user?.email), event.params.bot, name.toString())) {
            return fail(422, {
                error: `El diálogo ${name.toString()} ya existe`,
                name
            });
        }

        createDialog(emailToPath(event.locals.user?.email), event.params.bot, name.toString(), type.toString());
        return redirect(301, `/bots/${event.params.bot}/dialogs/${name.toString()}`)
    },

    delete: async (event) => {
        const formData = await event.request.formData();
        const dialog = formData.get("dialog")
        const type = formData.get("type")

        if(type === "relaxed") {
            removeStories(emailToPath(event.locals.user?.email), event.params.bot, dialog)
            removeDialog(emailToPath(event.locals.user?.email), event.params.bot, dialog)
        }
    }

} satisfies Actions;
