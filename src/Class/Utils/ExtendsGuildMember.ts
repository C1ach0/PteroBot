import {
    GuildMember, Role, Snowflake
} from "discord.js";

import ExtendsChannel from "./ExtendsChannel";

export default class ExtendsGuildMember extends ExtendsChannel {
    private event: GuildMember;

    constructor(event: GuildMember) {
        super(event.guild);
        this.event = event;
    }

    get getEvent() {
        return this.event;
    }

    getRole(roleId: string | Snowflake): Role {
        return this.getGuild.roles.cache.get(roleId);
    }
}