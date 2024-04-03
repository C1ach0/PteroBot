import 'reflect-metadata';
import {
    Events
} from "discord.js";


interface EventAnnotation {
    event: string|Events;
}

// Define the _Command decorator
function _Event(options: EventAnnotation) {
    return function (target: any) {
        Reflect.defineMetadata('_Event', options, target);
    };
}

export { EventAnnotation, _Event };