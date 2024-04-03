import ExtendsClient from "../Class/ExtendsClient";

// Définir l'interface pour la méthode execute
export default interface EventExecutor {
    execute(client: ExtendsClient, ...args): void;
}