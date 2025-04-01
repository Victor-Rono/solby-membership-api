/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from 'src/database/database.module';
import { SmsModule } from '../notifications/sms/sms.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { BaseAutomationService } from './services/base-automation/base-automation.service';


const imports: any[] = [
    DatabaseModule,
    HttpModule,
    NotificationsModule,
    // SmsModule,
]

const providers: any[] = [
]

const allExports = imports.concat(providers);

@Global()
@Module({
    imports,
    providers,
    exports: allExports,
    controllers: [],
})
export class BaseModule { }
