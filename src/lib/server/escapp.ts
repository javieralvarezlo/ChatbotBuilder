import { createFile, readFile } from "./fs";
import { getBotInfo } from "./rasa";

export const saveEscapp = (user: string, bot: string, data: Object) => {
    let botInfo = getBotInfo(user, bot);
    botInfo.escapp.url = data.url;
    botInfo.escapp.puzzle = data.puzzle;
    botInfo.escapp.solution = data.solution;
    botInfo.escapp.actionOptions = data.action;
    const newData = `ESCAPP_OPTIONS=${JSON.stringify(data)}`
    let file = readFile(`./data/${user}/${bot}/client/assets/index-F-HFJ1Yf.js`).toString();
    file = file.replace(/ESCAPP_OPTIONS={}/g, newData);
    file = file.replace('ESCAPP({endpoint:""', `ESCAPP({endpoint:"${data.url}"`)
    createFile(`./data/${user}/${bot}/client/assets/index-F-HFJ1Yf.js`, file)
    createFile(`./data/${user}/${bot}/info.json`, JSON.stringify(botInfo))
}