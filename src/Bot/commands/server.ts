import { join } from 'path';
import { _Command } from "../../Annotations/_Commands";
import { CommandContext } from "../../Class/CommandContext";
import ExtendsClient from "../../Class/ExtendsClient";
import CommandExecutor from "../../Executor/CommandExecutor";
import axios from "axios";
import WebSocket from "ws";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, ComponentType, Interaction, InteractionResponse, Message, MessageActionRowComponentBuilder, Snowflake, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";

@_Command({
    name: "server",
    description: "Connection sur un serveur afin de le gérer."
})
export default class Server implements CommandExecutor {
    private _client: ExtendsClient;
    private _ctx: CommandContext;
    private _serverId: string;
    private _messageId: String|Snowflake;
    private _server;

    async execute(client: ExtendsClient, ctx: CommandContext) {
        this._client = client;
        this._ctx = ctx;
        await this.getApiKey();
        const message = await this.selectServerEmbed();
        try {
            this.ServerSelectMenuCollector(async () => { this.ButtonCollector(); await this.showConsole(message) });
        } catch (err) {
            message.delete();
            
        }

    }

    private async getApiKey(): Promise<string | any> {
        const db = this._client.initDatabase(`user_${this._ctx.getUser.id}`);
        const apiKey = await db.get("api.key");
        if (!apiKey) {
            return this._ctx.reply({
                embeds: [
                    this._client.embed.Error({
                        description: `Vous n'avez pas défini de clé API. 
                        Veuillez en ajouter une : \`/api help\`.`
                    }, this._ctx.getUser)
                ]
            });
        }
        return apiKey;
    }

    private async fetchAllServers(): Promise<IServerAttributes[] | any> {
        const apiKey = await this.getApiKey();
        let data: IServerAttributes[] = [];
        const resp = await axios({
            method: "GET",
            url: `https://game.cyberspacehosting.fr/api/client`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            }
        });
        if (resp.status === 200) {
            const objs: IServer[] = resp.data["data"];
            if (objs.length <= 0) {
                const embed = this._client.embed.Warning({
                    title: "Achat d'un serveur.",
                    description: `Vous n'avez pas de serveurs, veuillez en acheter un sur notre site [CyberSpaceHosting](https://cyberspacehosting.fr).`
                }, this._ctx.getUser);
                return this._ctx.reply({
                    embeds: [embed]
                })
            }
            objs.forEach(obj => {
                data.push(obj.attributes)
            })

        } else {
            const embed = this._client.embed.Error({
                description: `La clé API fournie n'est pas correcte ou l'accès est refusé.`,
            }, this._ctx.getUser);
            return this._ctx.reply({
                embeds: [embed]
            });
        }
        return data;
    }

    private async getServerDetails(serverId: string) {
        const apiKey = await this.getApiKey();
        const resp = await axios({
            method: "GET",
            url: `https://game.cyberspacehosting.fr/api/client/servers/${serverId}`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            }
        });
        if (resp.status === 200) {
            return resp.data.attributes;
        }
    }

    private async showConsole(inMessage: InteractionResponse<boolean> | Message<true>) {
        try {
            const apiKey = await this.getApiKey();

            let wssToken, wssUrl;

            const resp = await axios({
                method: "GET",
                url: `https://game.cyberspacehosting.fr/api/client/servers/${this._serverId}/websocket`,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                }
            });
            if (resp.status === 200) {
                wssToken = resp.data.data.token;
                wssUrl = resp.data.data.socket;
            }

            const ws = new WebSocket(wssUrl, { origin: 'https://game.cyberspacehosting.fr' });

            ws.on("open", () => {
                const auth = JSON.stringify({ event: 'auth', args: [wssToken] });
                ws.send(auth);
                ws.send(JSON.stringify({ event: 'send logs', args: [] }));
                ws.send(JSON.stringify({ event: 'send stats', args: [] }));

            });

            ws.on("error", (error) => {
            });

            ws.on("close", (code, reason) => {
            });
            const MAX_STATS_EVENTS = 3;
            const MAX_CONSOLE_OUTPUT_EVENTS = 10;
            const MAX_STATUS_EVENTS = 3;
            const MAX_OTHERS_EVENTS = 3;

            const statsEvents = [];
            const consoleOutputEvents = [];
            const statusEvents = [];
            const othersEvents = [];

            ws.on("message", async (message) => {
                const parsedMessage = JSON.parse(message.toString());

                const eventType = parsedMessage.event;

                // Si le type d'événement n'existe pas encore dans l'objet, initialisez-le comme un tableau vide
                switch (eventType) {
                    case 'stats':
                        statsEvents.push(parsedMessage.args[0]);
                        if (statsEvents.length > MAX_STATS_EVENTS) {
                            statsEvents.shift(); // Supprimer le plus ancien
                        }
                        break;
                    case 'console output':
                        consoleOutputEvents.push(parsedMessage.args[0]);
                        if (consoleOutputEvents.length > MAX_CONSOLE_OUTPUT_EVENTS) {
                            consoleOutputEvents.shift(); // Supprimer le plus ancien
                        }
                        break;
                    case 'status':
                        statusEvents.push(parsedMessage.args[0]);
                        if (statusEvents.length > MAX_STATUS_EVENTS) {
                            statusEvents.shift(); // Supprimer le plus ancien
                        }
                        break;
                    default:
                        othersEvents.push(parsedMessage);
                        if (othersEvents.length > MAX_OTHERS_EVENTS) {
                            othersEvents.shift(); // Supprimer le plus ancien
                        }
                        break;
                }

                let EventList = [];
                EventList.push(statsEvents, consoleOutputEvents, statusEvents, othersEvents);
                await this.showInformationOfServer(inMessage, EventList);
            })
        } catch (err) {
            console.error(err);
        }
    }

    private async selectServerEmbed(): Promise<InteractionResponse<boolean> | Message<true>> {
        const servers = await this.fetchAllServers();

        const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('serverSelector')
                    .setPlaceholder('Sélectionnez un serveur')
                    .addOptions(
                        servers.map(server => ({
                            label: server.name,
                            value: server.identifier,
                        }))
                    )
            );

        const embed = this._client.embed.Info({
            title: "Sélectionnez un serveur",
            description: `
            Veuillez sélectionner un serveur parmis les serveurs disponibles.
            `
        }, this._ctx.getUser);

        const message = await this._ctx.reply({
            embeds: [embed],
            components: [actionRow],
        });
        this._messageId = message.id;
        return message;
    }

    private ServerSelectMenuCollector(funct: Function) {

        const filter = (interaction: Interaction) => {
            if (interaction.isCommand()) {
                return interaction.user.id === this._ctx.getUser.id
            } else if (interaction.isStringSelectMenu()) {
                return interaction.user.id === this._ctx.getUser.id
            }
            return false;
        };


        const collector = this._ctx.getCurrentChannel.createMessageComponentCollector({
            filter,
            componentType: ComponentType.StringSelect,
            time: 120_000
        });
        collector.on("collect", async (interaction: StringSelectMenuInteraction<CacheType>) => {
            interaction.deferUpdate();
            this._serverId = interaction.values[0];
            const server = await this.getServerDetails(interaction.values[0]);
            this._server = server;
            await funct();
        })
    }

    private CreateBtn() {
        const btnStart = new ButtonBuilder()
            .setCustomId("btnStart")
            .setLabel("Start")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("▶️");
        const btnStop = new ButtonBuilder()
            .setCustomId("btnStop")
            .setLabel("Stop")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🛑");
        const btnRestart = new ButtonBuilder()
            .setCustomId("btnRestart")
            .setLabel("Restart")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🔁");
        const btnKill = new ButtonBuilder()
            .setCustomId("btnKill")
            .setLabel("Kill")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("⚠️")
        const btnClose = new ButtonBuilder()
            .setCustomId("btnClose")
            .setLabel("Close")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🗑️")

        return new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents([
            btnStart, btnStop, btnRestart, btnKill, btnClose
        ])
    }

    private ButtonCollector() {

        const filter = (interaction: Interaction) => {
            return interaction.user.id === this._ctx.getUser.id;
        }

        const collectorButton = this._ctx.getCurrentChannel.createMessageComponentCollector({
            filter,
            componentType: ComponentType.Button
        })

        collectorButton.on("collect", async (interaction: ButtonInteraction<CacheType>) => {
            interaction.deferUpdate();
            switch (interaction.customId) {
                case "btnStart": {
                    await this.BtnPower("start");
                    break;
                }
                case "btnStop": {
                    await this.BtnPower("stop");
                    break;
                }
                case "btnRestart": {
                    await this.BtnPower("restart");
                    break;
                }
                case "btnKill": {
                    await this.BtnPower("kill");
                    break;
                }
                case "btnClose": {
                    this.btnClose(interaction);
                    break;
                }
            }
        })
    }

    private async BtnPower(state: string) {
        const apiKey = await this.getApiKey();
        axios({
            method: "POST",
            url: `https://game.cyberspacehosting.fr/api/client/servers/${this._serverId}/power`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            data: JSON.stringify({
                signal: state
            })
        })
            .catch(console.error);
    }

    private btnClose(interaction: ButtonInteraction<CacheType>) {
        const message = interaction.message;
        message.delete();
    }

    private async showInformationOfServer(message: InteractionResponse<boolean> | Message<true>, events: any[]) {
        // Vérifiez si this._server est bien initialisé et si vous pouvez accéder à this._server.name
        if (!this._server || !this._server.name) {
            console.error("Erreur : Serveur non initialisé ou nom du serveur introuvable.");
            return;
        }

        const Stats = events[0];
        const Console = events[1];
        const Status = events[2];
        const Others = events[3];
        const stats = JSON.parse(Stats[Stats.length - 1]);
        const networkInfo = this._server.relationships.allocations.data[0].attributes;
        const embed = this._client.embed.Info({
            title: `${this._server.name} - \`${this.Status(Status[Status.length - 1])}\``,
            description: `${Status[Status.length - 1] != "offline" && Console.length > 1 ? `
\`\`\`js
${Console.join("\n")}
\`\`\` ` : ""
                }
**Server Description**
\`\`\`
${this._server.description ? this._server.description : "Pas de description"}
\`\`\`
**Server Information**
\`\`\`yml
IP   : ${networkInfo.ip}
PORT : ${networkInfo.port}
\`\`\`
**Ressource Usage**
\`\`\`yml
CPU  : [ ${stats.cpu_absolute.toFixed(2)}% / ${this._server.limits.cpu}% ]
RAM  : [ ${this.convertBytes(BytesType.GIB, stats.memory_bytes).toFixed(2)} GiB / ${(this._server.limits.memory / 1000).toFixed(2)} GiB ]
DISK : [ ${this.convertBytes(BytesType.MIB, stats.disk_bytes).toFixed(2)} MiB / ${(this._server.limits.disk / 1000).toFixed(2)} GiB ]
\`\`\`
    `,
            fields: [
                { name: "Total Upload", value: `> 📤 ${this.convertBytes(BytesType.KIB, stats.network.tx_bytes).toFixed(2)} KiB`, inline: true },
                { name: "Total Download", value: `> 📥 ${this.convertBytes(BytesType.KIB, stats.network.rx_bytes).toFixed(2)} KiB`, inline: true }
            ]
        }, this._ctx.getUser);
        try {
            // Essayez d'éditer le message avec le nouvel embed
            await message.edit({
                embeds: [embed],
                components: [this.CreateBtn()]
            });
        } catch (error) {
            const msg = this._ctx.getCurrentChannel.messages.cache.get(this._messageId as string);
            if(msg.deletable) {
                msg.delete();
            } else {
                console.error("message cannot be deleted", "error : ", error)
            }
        }
    }

    private convertBytes(to: BytesType, bytes: number): number {
        switch (to) {
            case BytesType.KIB: {
                return bytes / 1024;
            }
            case BytesType.MIB: {
                return bytes / Math.pow(1024, 2);
            }
            case BytesType.GIB: {
                return bytes / Math.pow(1024, 3);
            }
        }
    }

    private Status(status: string) {
        switch (status) {
            case "offline":
                return "🔴 Offline";
            case "starting":
                return "🟡 Starting";
            case "running":
                return "🟢 Running";
            case "stopping":
                return "🟠 Stopping";

        }
    }
}

// Types
interface IServer {
    object: string;
    attributes: IServerAttributes;
}
interface IServerAttributes {
    [key: string]: any;
    identifier: string;
    name: string;
    status: string | null;
}
enum BytesType {
    KIB, MIB, GIB
}
