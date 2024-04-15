import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async ({ locals, params, parent }) => {
    const { bot } = await parent();
    return {
        bot
    }
}