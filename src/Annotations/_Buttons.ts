import { PermissionResolvable } from "discord.js";


interface ButtonAnnotation {
    buttonId: string;
}

// Define the _Command decorator
function _Button(options: ButtonAnnotation) {
    return function (target: any) {
        Reflect.defineMetadata('_Button', options, target);
    };
}

function _MultiButton(options: ButtonAnnotation[]) {
    return function(target: any) {
        Reflect.defineMetadata('_MultiButton', options, target)
    }
}

export { ButtonAnnotation, _Button, _MultiButton };