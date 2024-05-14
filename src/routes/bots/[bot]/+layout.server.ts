import { getDomainFile, getNluFile } from '$lib/server/rasa'
import { emailToPath } from '$lib/services/utils'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals, params }) => {
    const domainFile = getDomainFile(emailToPath(locals.user?.email), params.bot);
    const nluFile = getNluFile(emailToPath(locals.user?.email), params.bot);

    return {
        bot: params.bot,
        domainFile,
        nluFile
    }
}



