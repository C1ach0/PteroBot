import 'reflect-metadata';
import {
    ApplicationCommandOptionType,
    PermissionResolvable

} from "discord.js";


// Define the CommandAnnotation interface
interface CommandAnnotation {
    name: string,
    description: string,
    usage?: string,
    categorie?: string,
    member_permission?: bigint|PermissionResolvable,
    options?: Options[];
    enabled?: boolean;
}


interface Options {
    name: string;
    description: string;
    type: number|ApplicationCommandOptionType;
    required?: boolean;
    autocomplete?: boolean;
    options?: Options[]
}

// Define the _Command decorator
function _Command(options: CommandAnnotation) {
    return function (target: any) {
        Reflect.defineMetadata('_Command', options, target);
    };
}

// Export the CommandAnnotation interface and _Command decorator
export { CommandAnnotation, _Command };