import ExtendsClient from "../Class/ExtendsClient";
import { CommandAnnotation, _Command } from '../Annotations/_Commands';
import {
    ApplicationCommandType,
    PermissionsBitField
} from "discord.js";
import fs, { statSync } from "fs";
import { join } from "path";
import chalk from "chalk";
import 'reflect-metadata';
import { Routes } from 'discord-api-types/v9';
import { REST } from '@discordjs/rest';
import { Logger } from "../Class/Logger";
const logger = new Logger();
import Table from "cli-table3";
// Tableaux pour la console 
const commandsByCategory: { [key: string]: any[] } = {
    Others: [] // Initialisez un tableau pour les commandes sans catégorie
};


function displayCommandsByCategory(commandsByCategory : { [key: string]: any[] }) {
    const table = new Table({
        head: ['Name', 'Description'],
        colWidths: [20, 70],
        wordWrap: true,
    })

    for (const [category, commands] of Object.entries(commandsByCategory)) {
        table.push([{
            colSpan: 2, content: chalk.bold(`Category: ${category}`)
        }])

        for (const command of commands) {
            const commandAnnotation: CommandAnnotation = Reflect.getMetadata('_Command', command);
            if (commandAnnotation) {
                table.push([chalk.underline("/"+commandAnnotation.name), commandAnnotation.description]);
            }
        }
    }

    console.log(table.toString());
}



export default function RegisterCommands(client: ExtendsClient, dir: string) {
    logger.sendLog("SUCCESS", "Initialisations des Commandes")
    const CommandDir: string = join(__dirname, "..", dir);
    loadCommand(client, CommandDir);
}

function loadCommand(client: ExtendsClient, dir: string) {
    const slashCommands = [];
    fs.readdirSync(dir).forEach(async (file) => {
        const filePath = join(dir, file);
        const stat = statSync(filePath);
        if (stat.isDirectory()) {
            loadCommand(client, filePath);
        } else if (file.endsWith('.js') || file.endsWith('.ts')) {
            const CommandClass = require(filePath).default;
            const commandAnnotation: CommandAnnotation = Reflect.getMetadata('_Command', CommandClass);
            if (commandAnnotation) {
                slashCommands.push({
                    name: commandAnnotation.name,
                    description: commandAnnotation.description,
                    type: ApplicationCommandType.ChatInput,
                    options: commandAnnotation.options ? commandAnnotation.options : null,
                    default_member_permissions: commandAnnotation.member_permission ? PermissionsBitField.resolve(commandAnnotation.member_permission).toString() : null
                })
                if(commandAnnotation.name) {
                    client.commands.set(commandAnnotation.name, CommandClass)
                } else {
                    console.log("no name")
                }

                const categorie = commandAnnotation.categorie || "Others";
                if(!commandsByCategory[categorie]) {
                    commandsByCategory[categorie] = [];
                }
                commandsByCategory[categorie].push(CommandClass);
            } else {
                console.log(chalk.yellow(`File '${file}' does not have a valid _Command annotation.`));
            }
        } else {
            console.log("pas lu : ", file)
        }
    })
    Routing(client, slashCommands);
}

async function Routing(client: ExtendsClient, slashCommands: any[]) {
    const rest = new REST({ version: '10' }).setToken(client.token);
    try {
        await rest.put(
            client.Config?.guild?.id ?
                Routes.applicationGuildCommands(client.Config.bot.id, client.Config?.guild?.id) :
                Routes.applicationCommands(client.Config.bot.id),
            { body: slashCommands }
        );
        displayCommandsByCategory(commandsByCategory);
    } catch (error) {
        console.log(error);
    };
}