import { mkdirSync, existsSync, readdirSync, rmdir, rmdirSync, cpSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const DATA_DIR = `data`;
export const DEFAULT_RASA = `default-rasa`

export const dirExists = (username: string): boolean => {
    return existsSync(`./${DATA_DIR}/${username}`);
}

export const createUserFolder = (username: string) => {
    mkdirSync(`./${DATA_DIR}/${username}`, { recursive: true });
}

export const createFile = (file: string, content: string) => {
    writeFileSync(file, content);
}

export const readFile = (file: string) => {
    return readFileSync(file);
}

export const foldersIn = (dir: string | undefined): string[] => {
    return readdirSync(`./${DATA_DIR}/${dir}`);
}

export const userHasBot = (email: string | undefined, bot: string): boolean => {
    return existsSync(`./${DATA_DIR}/${email}/${bot}`);
}

export const createBot = (email: string | undefined, bot: string, description: string) => {
    mkdirSync(`./${DATA_DIR}/${email}/${bot}`);
    createFile(`./${DATA_DIR}/${email}/${bot}/info.json`, JSON.stringify({name: bot, description, dialogs: []}));
    cpSync(`./${DEFAULT_RASA}`, `/${DATA_DIR}/${email}/${bot}`, { recursive: true })
}

export const deleteBot = (email: string | undefined, bot: string) => {
    rmdirSync(`./${DATA_DIR}/${email}/${bot}/`, { recursive: true });
}

export const botsWithDescription = (user: string) => {
    let bots: any[] = [];
    let botStrings: any = [];
    let dirs = foldersIn(`${user}`);
    dirs.forEach(dir => {
        let info;
        try {
            info = JSON.parse(readFileSync(join(`./${DATA_DIR}/${user}/${dir}/`, 'info.json'), { encoding: 'utf-8' }));
        } catch (err) { }
        bots.push({
            name: dir,
            description: info.description
        })
        botStrings.push(`${dir}:@:${info.description}`)
    })

    return { bots, botStrings };
}