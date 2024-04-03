import { _Event } from "../../Annotations/_Events";
import ExtendsClient from "../../Class/ExtendsClient";
import EventExecutor from "../../Executor/EventExecutor";
import {
    Events
} from "discord.js"

@_Event({event: Events.ClientReady})
export default class Ready implements EventExecutor {
    private _client: ExtendsClient;

    execute(client: ExtendsClient): void {
        this._client = client;
        console.log(`Bot lancé : ${client.user.username} | Ping : ${client.ws.ping}`)


    }

    private Status() {
        this._client.user.setActivity({
            name: ""
        })
    }
}
