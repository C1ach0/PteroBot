import { CommandContext } from "../Class/CommandContext";
import ExtendsClient from "../Class/ExtendsClient";
import {
    AutocompleteInteraction,
    ApplicationCommandOptionChoiceData
} from "discord.js";


export interface Choices {
    [key: string]: any;
}

export default interface AutoCompletion {
    autoCompletion(interaction: AutocompleteInteraction, choices: ApplicationCommandOptionChoiceData<string | number>[]): void;
}