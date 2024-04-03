import {
    ChatInputCommandInteraction, 
    MessagePayload, 
    InteractionReplyOptions,
    MessageCreateOptions, 
    InteractionResponse,
    Message,
} from "discord.js";
import ExtendsChannel from "./Utils/ExtendsChannel";

export class CommandContext extends ExtendsChannel {
    private event: ChatInputCommandInteraction;

    constructor(event: ChatInputCommandInteraction) {
        super(event.guild);
        this.event = event;
    }

    get getEvent(): ChatInputCommandInteraction { return this.event };
    get getCurrentChannel() { return this.event.channel };
    get getUser() { return this.event.user; }
    get getGuild() { return this.event.guild; }
    get getSubCommand(): string | null {
        return this.event.options.getSubcommand();
    }
    get getSubCommandGroup(): string | null {
       return this.event.options.getSubcommandGroup();
    }
    getMember() {
        return this.getGuild.members.cache.get(this.getUser.id);
    }
    getOption(value: string) {
        return this.event.options.get(value)
    }
    send(options: string | MessagePayload | MessageCreateOptions): Promise<Message<true>> {
        return this.getCurrentChannel.send(options);
    }
    reply(options: string | MessagePayload | InteractionReplyOptions): Promise<InteractionResponse<boolean>> {
        return this.event.reply(options);
    }
}