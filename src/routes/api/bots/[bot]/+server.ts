import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { userHasBot } from '$lib/server/fs';
import { emailToPath } from '$lib/services/utils';
import AdmZip from 'adm-zip';
import path from 'path';

export const GET: RequestHandler = ({ url, params, locals }) => {

    const bot = params.bot;

    if (!userHasBot(emailToPath(locals.user?.email), bot)) {
        return new Response(String("No existe ese bot"))
    }

    const zip = new AdmZip();

    zip.addLocalFolder(path.resolve(`./data/${emailToPath(locals.user?.email)}/${bot}`))


    const zipBuffer = zip.toBuffer();

    return new Response(zipBuffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${bot}.zip"`
        }
      });
};