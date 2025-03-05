/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventsService extends EventEmitter2 {
    // emit<K extends keyof EventPayloadMap>(event: K, payload: EventPayloadMap[K]): boolean {
    //     return super.emit(event, payload);
    // }

    // on<K extends keyof EventPayloadMap>(event: K, listener: (payload: EventPayloadMap[K]) => void): this {
    //     return super.on(event, listener);
    // }

    // once<K extends keyof EventPayloadMap>(event: K, listener: (payload: EventPayloadMap[K]) => void): this {
    //     return super.once(event, listener);
    // }
} {

}
