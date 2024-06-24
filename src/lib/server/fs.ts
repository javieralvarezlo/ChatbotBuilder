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
    createFile(`./${DATA_DIR}/${email}/${bot}/info.json`, JSON.stringify({
        name: bot, description, dialogs: [
            {
                "name": "saludar",
                "type": "relaxed",
                "steps": [],
                "flow": {
                    "nodes": [
                        {
                            "id": "0.8054622613307012",
                            "type": "action",
                            "position": {
                                "x": 417,
                                "y": 91.5
                            },
                            "data": {
                                "type": "action",
                                "name": "saluda"
                            },
                            "origin": [
                                0.5,
                                0
                            ],
                            "measured": {
                                "width": 107,
                                "height": 51
                            },
                            "selected": false,
                            "dragging": false
                        },
                        {
                            "id": "0.7294906436859769",
                            "type": "intent",
                            "position": {
                                "x": 212.75,
                                "y": 79.75
                            },
                            "data": {
                                "type": "intent",
                                "name": "saludar"
                            },
                            "origin": [
                                0.5,
                                0
                            ],
                            "measured": {
                                "width": 124,
                                "height": 51
                            },
                            "selected": true,
                            "dragging": false
                        }
                    ],
                    "edges": [
                        {
                            "source": "0.7294906436859769",
                            "target": "0.8054622613307012",
                            "id": "xy-edge__0.7294906436859769-0.8054622613307012"
                        }
                    ]
                }
            }
        ], escapp: {
            puzzle: 2,
            solution: "solución",
            url: "https://escapp.etsisi.upm.es/api/escapeRooms/147/",
            actionOptions: []
        }
    }));
    cpSync(`./${DEFAULT_RASA}/`, `./${DATA_DIR}/${email}/${bot}/`, { recursive: true })
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