import { saveEscapp } from '$lib/server/escapp';
import { emailToPath } from '$lib/services/utils';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from "./$types";
import { saveCustomization } from '$lib/server/customization';
import { getBotImage } from '$lib/server/fs';


export const load: PageServerLoad = async ({ locals, params, parent }) => {
    const { bot, domainFile, botInfo } = await parent();
    let responses = domainFile.responses;
    let themes = [{ value: "default", name: "Por defecto" }, { value: "whatsapp", name: "WhatsApp" }]
    const botImage = getBotImage(emailToPath(locals.user?.email), bot)

    return {
        bot,
        responses,
        botInfo,
        themes,
        botImage
    }
}


export const actions = {
    save: async (event) => {
        const formData = await event.request.formData();
        const name = formData.get("name")
        const theme = formData.get("theme")
        const profile = formData.get("profile")
        const inspector = formData.get("inspector")
        const customizationData = {
            name,
            theme,
            profile,
            inspector
        }
        saveCustomization(emailToPath(event.locals.user?.email), event.params.bot, customizationData)

        return redirect(301, `/bots/${event.params.bot}`)

    }
} satisfies Actions;