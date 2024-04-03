import "reflect-metadata";
import Client from "./Class/ExtendsClient"
import {bot1} from "./config.json"
new Client({
    folder: {
        events: "Bot/events",
        commands: "Bot/commands",
        buttons: "Bot/buttons"
    },
    config: {
        bot: bot1
    }
});