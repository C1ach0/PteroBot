import { ApplicationCommandOptionType, AttachmentBuilder } from "discord.js";
import { _Command } from "../../Annotations/_Commands";
import { CommandContext } from "../../Class/CommandContext";
import ExtendsClient from "../../Class/ExtendsClient";
import CommandExecutor from "../../Executor/CommandExecutor";
import axios from "axios";
import { join } from "path";

@_Command({
    name: "api",
    description: "Gestion API client",
    options: [
        {
            name: "set",
            description: "Mettre à jour la clé API",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "key",
                    description: "Mettre la clé API",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "help",
            description: "Donner une aide pour savoir comment sa fonctionne.",
            type: ApplicationCommandOptionType.Subcommand
        }
    ]
})
export default class Api implements CommandExecutor {
    async execute(client: ExtendsClient, ctx: CommandContext) {
        const db = client.initDatabase(`user_${ctx.getUser.id}`);

        switch (ctx.getSubCommand) {
            case "set": {
                const apiKey = ctx.getOption("key").value;

                axios({
                    method: 'get',
                    url: 'https://game.cyberspacehosting.fr/api/client/account',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    }
                }).then(async resp => {
                    if (resp.status === 200) {
                        const user = resp.data["attributes"];
                        await db.set("api.key", apiKey);
                        const embed = client.embed.Success({
                            title: `Bienvenue ${user.username} !`,
                            description: `Votre clé API à été enregistrer.`
                        }, ctx.getUser);
                        ctx.reply({
                            embeds: [embed]
                        })
                    } else {
                        const embed = client.embed.Error({
                            description: `La clé API fournie n'est pas correcte ou l'accès est refusé.`,
                        }, ctx.getUser);
                        ctx.reply({
                            embeds: [embed],
                            ephemeral: true,
                        });
                    }
                })
                    .catch(error => {
                        const embed = client.embed.Error({
                            description: `Une erreur s'est produite lors de la requête API : ${error.message}`,
                        }, ctx.getUser);
                        ctx.reply({
                            embeds: [embed],
                            ephemeral: true,
                        });
                    });
                break;
            }
            case "help": {
                const file = new AttachmentBuilder(join(__dirname, "..", "assets", "help.png"));
                const embed = client.embed.Info({
                    title: "Installation de la clé API",
                    description: `
                    Afin d'installer la clé API vous devez aller sur le [Panel](https://game.cyberspacehosting.fr/).
                    Dans "My profile" et créer une nouvelle clé API.
                    `,
                    image: {
                        url: 'attachment://help.png',
                    },
                }, ctx.getUser);
                ctx.reply({ embeds: [embed], files: [file] });
                break;
            }
        }


    }
}