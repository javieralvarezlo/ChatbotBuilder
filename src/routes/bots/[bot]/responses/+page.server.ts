import { saveResponses } from '$lib/server/rasa';
import { emailToPath } from '$lib/services/utils';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from "./$types";


export const load: PageServerLoad = async ({ locals, params, parent }) => {
    const { bot, domainFile } = await parent();
    let responses = domainFile.responses

    return {
        bot,
        responses
    }
}


export const actions = {
    save: async (event) => {
        const formData = await event.request.formData();
        const responses = JSON.parse(formData.get("responses") );
        console.log("Guardando")
        saveResponses(emailToPath(event.locals.user?.email), event.params.bot, responses)
        return redirect(301, `/bots/${event.params.bot}`)
    }
} satisfies Actions;