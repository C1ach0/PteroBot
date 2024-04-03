import { _Event } from "../Annotations/_Events";
import ExtendsClient from "../Class/ExtendsClient";
import EventExecutor from "../Executor/EventExecutor";
import CommandExecutor from "../Executor/CommandExecutor";
import { CommandContext } from "../Class/CommandContext";
import {
  Interaction
} from "discord.js"
import AutoCompletion from "../Executor/AutoCompletion";
import { ButtonExecutor } from "../Executor/ButtonExecutor";

@_Event({ event: "interactionCreate" })
export default class InteractionCreate implements EventExecutor {
  async execute(client: ExtendsClient, interaction: Interaction): Promise<void | boolean | any> {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      const commandInstance: CommandExecutor = new command();
      commandInstance.execute(client, new CommandContext(interaction))
    } else if (interaction.isAutocomplete()) {
      const command = client.commands.get(interaction.commandName);
      if(!command) return;
      const commandInstance: AutoCompletion = new command();
      if(!commandInstance.autoCompletion) return;
      commandInstance.autoCompletion(interaction, []);
    } else if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId)
      if(!button) return;
      const buttonInstance: ButtonExecutor = new button();
      buttonInstance.execute(client, interaction);
    }
  }
}