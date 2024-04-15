import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async ({ locals, params, parent }) => {
    const { bot, domainFile } = await parent();
    let responses = domainFile.responses

    return {
        bot,
        responses
    }
}