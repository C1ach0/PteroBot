import ExtendsClient from "../Class/ExtendsClient";
import { CommandContext } from "../Class/CommandContext";

// Définir l'interface pour la méthode execute
export default interface CommandExecutor {
    execute(client: ExtendsClient, ctx: CommandContext): void;
}