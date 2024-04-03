import {
    EmbedBuilder,
    APIEmbed,
    EmbedData,
    User
} from "discord.js";

export class Embed {

    public Custom(data: APIEmbed | EmbedData) {
        return new EmbedBuilder(data);
    }

    public Info(data: APIEmbed | EmbedData, user: User) {
        let emb = new EmbedBuilder(data);
        emb.setColor("Blue");
        this.addFooter(emb, user)
        return emb;
    }
    
    public Success(data: APIEmbed | EmbedData, user: User) {
        let emb = new EmbedBuilder(data);
        emb.setColor("DarkGreen");
        this.addFooter(emb, user)
        return emb;
    }

    public Warning(data: APIEmbed | EmbedData, user: User) {
        let emb = new EmbedBuilder(data);
        emb.setColor("Orange");
        this.addFooter(emb, user)
        return emb;
    }

    public Error(data: APIEmbed | EmbedData, user: User) {
        let emb = new EmbedBuilder(data);
        emb.setColor("Red");
        this.addFooter(emb, user)
        return emb;
    }

    private addFooter(embed: EmbedBuilder, user: User) {
        embed.setFooter({
            text: `Exécuté par ${user.username}`,
            iconURL: user.displayAvatarURL()
        });
    }
}