import { exec, spawn } from "child_process"
import { createFile, readFile } from "./fs"
import { load, dump } from "js-yaml"

export const getDomainFile = (user: string, bot: string): any => {
    let file = readFile(`./data/${user}/${bot}/domain.yml`).toString()
    let doc = load(file)
    return doc
}

export const getNluFile = (user: string, bot: string): any => {
    let file = readFile(`./data/${user}/${bot}/data/nlu.yml`).toString()
    let doc = load(file)
    return doc
}

export const getStories = (user: string, bot: string): any => {
    let file = readFile(`./data/${user}/${bot}/data/stories.yml`).toString()
    let doc = load(file)
    return doc
}

export const getRules = (user: string, bot: string): any => {
    let file = readFile(`./data/${user}/${bot}/data/rules.yml`).toString()
    let doc = load(file)
    return doc
}

export const getBotInfo = (user: string, bot: string): any => {
    return JSON.parse(readFile(`./data/${user}/${bot}/info.json`).toString())
}

export const saveResponses = (user: string, bot: string, responses: any) => {
    let domainFile = getDomainFile(user, bot);
    domainFile.responses = responses;
    let doc = dump(domainFile)
    createFile(`./data/${user}/${bot}/domain.yml`, doc)
}

export const saveSlots = (user: string, bot: string, slots: any) => {
    let domainFile = getDomainFile(user, bot);
    domainFile.slots = slots;
    let doc = dump(domainFile)
    createFile(`./data/${user}/${bot}/domain.yml`, doc)
}

export const saveIntents = (user: string, bot: string, intents: any) => {
    let nluFile = getNluFile(user, bot);
    let domainFile = getDomainFile(user, bot);

    let domainIntents: any[] = [];
    intents.map((i: { intent: any }) => { domainIntents.push(i.intent) })
    domainFile.intents = domainIntents;
    nluFile.nlu = intents;
    let doc = dump(nluFile)
    let domain = dump(domainFile)
    createFile(`./data/${user}/${bot}/domain.yml`, domain)
    createFile(`./data/${user}/${bot}/data/nlu.yml`, doc)
}

export const saveDialog = (user: string, bot: string, dialog: string, nodes: any, edges: any, type: string) => {
    let botInfo = getBotInfo(user, bot);
    botInfo.dialogs.find((el: { name: string }) => el.name === dialog).flow.nodes = nodes;
    botInfo.dialogs.find((el: { name: string }) => el.name === dialog).flow.edges = edges;
    botInfo.dialogs.find((el: { name: string }) => el.name === dialog).type = type;
    createFile(`./data/${user}/${bot}/info.json`, JSON.stringify(botInfo))
}

export const saveStories = (user: string, bot: string, stories: any) => {
    let s = getStories(user, bot);
    s.stories = stories;
    let doc = dump(s);
    createFile(`./data/${user}/${bot}/data/stories.yml`, doc);
}

export const saveRules = (user: string, bot: string, rules: any) => {
    let r = getRules(user, bot);
    r.rules = rules;
    let doc = dump(r);
    createFile(`./data/${user}/${bot}/data/rules.yml`, doc);
}

export const removeStories = (user: string, bot: string, story: string) => {
    let s = getStories(user, bot);
    s.stories = s.stories.filter(st => !st.story.startsWith(story))
    saveStories(user, bot, s.stories)
}

export const createDialog = (user: string, bot: string, name: string, type: string) => {
    let botInfo = getBotInfo(user, bot);
    const dialog = { name, type, steps: [], flow: { nodes: [], edges: [] } }
    botInfo.dialogs.push(dialog)
    createFile(`./data/${user}/${bot}/info.json`, JSON.stringify(botInfo))
}

export const existsDialog = (user: string, bot: string, name: string) => {
    let botInfo = getBotInfo(user, bot);
    return botInfo.dialogs.find((el: { name: string }) => el.name === name)
}

export const removeDialog = (user: string, bot: string, name: string) => {
    let botInfo = getBotInfo(user, bot);
    botInfo.dialogs = botInfo.dialogs.filter((el: { name: string }) => el.name !== name)
    createFile(`./data/${user}/${bot}/info.json`, JSON.stringify(botInfo))
}

