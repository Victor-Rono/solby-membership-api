/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsService } from './services/events/events.service';

const providers: any[] = [
    EventsService,
];

const imports: any[] = [
    EventEmitterModule.forRoot(),
];


@Module({
    imports,
    providers,
    exports: providers.concat(imports),
})

// @Global()
export class EventsModule { }
