import { saveIntents } from '$lib/server/rasa';
import { emailToPath } from '$lib/services/utils';
import type { PageServerLoad } from './$types';
import type { Actions } from "./$types";


export const load: PageServerLoad = async ({ locals, params, parent }) => {
    const { bot, nluFile } = await parent();
    let intents = nluFile.nlu

    intents.map(i => {
        i.examples = examplesStringToList(i.examples)
    });

    return {
        bot,
        intents
    }
}

export const actions = {
    save: async (event) => {
        const formData = await event.request.formData();
        const intents = JSON.parse(formData.get("intents"));
        intents.forEach((intent: any) => {
            let examples = [];
            intent.examples.forEach((example: any) => {
                examples += `- ${example}\n`
            })
            intent.examples = examples
        })
        saveIntents(emailToPath(event.locals.user?.email), event.params.bot, intents)
    }
} satisfies Actions;

const examplesStringToList = (examples: string) => {
    let ex = examples.split('\n');
    ex.forEach((e, id) => {
        ex[id] = e.split('- ')[1]
    })
    return ex.slice(0, ex.length - 1)
}