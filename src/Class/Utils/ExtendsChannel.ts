import {
    Guild, Snowflake,
    Channel, GuildChannel, GuildBasedChannel,
    // Types Channel Text
    NewsChannel, StageChannel, TextChannel, PrivateThreadChannel, PublicThreadChannel, VoiceChannel,
    // Types Channel Voice
    VoiceBasedChannel,
    GuildMember
} from "discord.js";

export default class ExtendsChannel {
    private guild: Guild;

    constructor(guild: Guild) {
        this.guild = guild;
    }

    get getGuild(): Guild {
        return this.guild;
    }

    getChannel(channelId: string | Snowflake): GuildBasedChannel | null {
        return this.guild.channels.cache.get(channelId) || null;
    }

    getTextChannel(
        channelId: string | Snowflake
    ): NewsChannel | StageChannel | TextChannel | PrivateThreadChannel | PublicThreadChannel | VoiceChannel | null {
        const chx = this.getChannel(channelId);
        return chx?.isTextBased() ? chx : null;
    }

    getVoiceChannel(channelId: string | Snowflake): VoiceBasedChannel | null {
        const chx = this.getChannel(channelId);
        return chx?.isVoiceBased() ? chx : null;
    }
}