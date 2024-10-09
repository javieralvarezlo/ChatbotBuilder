import { writeFile, writeFileSync } from "node:fs";
import { createFile, readFile } from "./fs";
import { getBotInfo } from "./rasa";
import sharp from "sharp"

export const saveCustomization = async (user: string, bot: string, data: Object) => {
    let botInfo = getBotInfo(user, bot);
    if (!data.theme) {
        data.theme = "default"
    }
    botInfo.customization.name = data.name;
    botInfo.customization.theme = data.theme;
    botInfo.customization.inspector = data.inspector
    const newData = `CUSTOMIZATION_OPTIONS=${JSON.stringify(data)}`
    let file = readFile(`./data/${user}/${bot}/client/assets/index-CxZTfXIx.js`).toString();
    file = file.replace(/CUSTOMIZATION_OPTIONS={}/g, newData);
    createFile(`./data/${user}/${bot}/client/assets/index-CxZTfXIx.js`, file)
    createFile(`./data/${user}/${bot}/info.json`, JSON.stringify(botInfo))

    if(data.profile.size !== 0) {
        console.log(data.profile)
        const arrayBuffer = await data.profile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const newBuffer = await sharp(buffer).jpeg().toBuffer()
        writeFileSync(`./data/${user}/${bot}/client/assets/perfil-B2gM2GLS.jpg`, newBuffer)
        //writeFile(`./data/${user}/${bot}/client/assets/perfil-B2gM2GLS.jpg`, await data.profile.text())
        data.profile.text().then(data => {
            //writeFileSync(`./data/${user}/${bot}/client/assets/perfil-B2gM2GLS.jpg`, data)
            //createFile(`./data/${user}/${bot}/client/assets/perfil-B2gM2GLS.jpg`, data)
        })
        
    }
}