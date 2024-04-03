import { _Event } from "../../Annotations/_Events";
import ExtendsClient from "../../Class/ExtendsClient";
import EventExecutor from "../../Executor/EventExecutor";
import {
    Events, Message, EmbedBuilder, Snowflake, GuildMember,
    version as discordjsVersion
} from "discord.js"
import {
    cpu
} from 'node-os-utils';

const version = "1.0.0";

@_Event({ event: Events.MessageCreate })
export default class MessageCreate implements EventExecutor {
    async execute(client: ExtendsClient, message: Message) {
        try {
            if (message.content != `<@${client.user.id}>`) return;
            const embed = new EmbedBuilder()
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription(`
🤍 - **__Informations globales du bot :__**\n
\`\`\`
Nom     ➜ ${client.user.username}
ID      ➜ ${client.user.id}
Version ➜ ${version}
\`\`\`
🤍 - **__Développeurs :__**\n
➜ kuracho - [Rosydev](https://rosydev.fr) | [Portfolio](https://max.rosydev.fr)

🤍 - **__Informations avancées du bot :__**\n
\`\`\`
OS          ➜ ${process.platform} ${process.arch}
Cores       ➜ ${cpu.count()}
CPU Usage   ➜ ${await cpu.usage()} %
RAM Usage   ➜ ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
Node        ➜ ${process.version.replace("v", "")}
DiscordJS   ➜ ${discordjsVersion}
\`\`\`
> Nombre de commande que je possède : \` ${client.commands.size} \`
> Je suis codé en Typescript avec Reflect Metadata 🫡.
`)
                .setColor("White");
            message.reply({ embeds: [embed] }).catch(console.error)

        } catch (err) {
            console.error(err);
        }
    }
}
