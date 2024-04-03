import {
    ClientOptions as ClientOpt,
    Snowflake
} from "discord.js"

export interface ClientOptions {
    client?: ClientOpt;
    folder: Folder;
    config: Config;
}

export interface Folder {
    commands?: string,
    buttons?: string,
    events?: string,
}

export interface Config {
    bot: {
        token: string;
        id: string;
    },
    guild?: {
        id?: string;
    }
}