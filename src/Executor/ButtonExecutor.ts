import { ButtonInteraction } from "discord.js";
import ExtendsClient from "../Class/ExtendsClient";


export interface ButtonExecutor {
    execute(client: ExtendsClient, interaction: ButtonInteraction): void;
}

export interface MulitButtonExecutor {
    execute(client: ExtendsClient, buttons: any): void;
}


