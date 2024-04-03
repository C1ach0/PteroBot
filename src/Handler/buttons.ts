import ExtendsClient from "../Class/ExtendsClient";
import fs, { statSync } from "fs";
import { join } from "path";
import chalk from "chalk";
import 'reflect-metadata';
import { Logger } from "../Class/Logger";
import { ButtonAnnotation } from "../Annotations/_Buttons";
const logger = new Logger();

export default function RegisterButtons(client: ExtendsClient, dir: string) {
    logger.sendLog("SUCCESS", "Initialisations des Boutons")
    const ButtonDir: string = join(__dirname, "..", dir);
    LoadButton(client, ButtonDir)
}

function LoadButton(client: ExtendsClient, dir: string) {
    fs.readdirSync(dir).forEach(file => {
        const filePath = join(dir, file);
        const stat = statSync(filePath);
        if (stat.isDirectory()) {
            LoadButton(client, filePath);
        } else if (file.endsWith(".js") || file.endsWith(".ts")) {
            const ButtonClass = require(filePath).default;
            const buttonAnnotations: ButtonAnnotation = Reflect.getMetadata('_Button', ButtonClass);
            // const multiButtonAnnotations: ButtonAnnotation[] = Reflect.getMetadata('_MultiButton', ButtonClass);
            client.buttons.set(buttonAnnotations.buttonId, ButtonClass)
            console.log(chalk.green(`Button '${buttonAnnotations.buttonId}' registered.`));
            // else if (multiButtonAnnotations) {
            //     multiButtonAnnotations.forEach(btn => {
            //         client.buttons.set(btn.buttonId, ButtonClass)
            //     })
            // }
        }
    })
}