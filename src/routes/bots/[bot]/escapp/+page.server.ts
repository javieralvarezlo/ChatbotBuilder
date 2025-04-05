import { saveEscapp } from '$lib/server/escapp';
import { saveResponses } from '$lib/server/rasa';
import { emailToPath } from '$lib/services/utils';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from "./$types";


export const load: PageServerLoad = async ({ locals, params, parent }) => {
    const { bot, domainFile, botInfo } = await parent();
    let responses = domainFile.responses;
    let actions: { value: string; name: string; }[] = []
    Object.keys(responses).map(response => {
        actions.push({ value: response, name: response.split("utter_")[1] })
    })


    return {
        bot,
        responses,
        botInfo,
        actions
    }
}


export const actions = {
    save: async (event) => {
        const formData = await event.request.formData();
        const puzzle = formData.get("puzzle")
        const url = formData.get("url")
        const solution = formData.get("solution")
        const action = formData.get("action")
        const responses = JSON.parse(formData.get("responses"))
        let actionOptions: any[] = []
        responses[action].map((res: { text: any; }) => {
            actionOptions = [...actionOptions, res.text]
        })
        const escappData = {
            url,
            puzzle,
            solution,
            actionOptions,
            action,
            appPuzzleIds: [puzzle]
        }
        saveEscapp(emailToPath(event.locals.user?.email), event.params.bot, escappData)

        return redirect(301, `/bots/${event.params.bot}`)

    }
} satisfies Actions;