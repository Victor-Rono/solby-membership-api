/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'stream';
import { SMSEventsEnum } from './shared/interfaces/sms.interface';

@Injectable()
export class AppService {

  constructor(
    // private eventEmitter: EventEmitter,
  ) {

  }
  getHello(): string {
    return 'Hello World!';
  }


}
