/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BaseAutomationService {
    @Inject(DatabaseService)
    public readonly databaseService: DatabaseService;

    @Inject(EventEmitter2)
    public readonly eventEmitter: EventEmitter2;
}
