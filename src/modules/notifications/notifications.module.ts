/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SmsController } from './controllers/sms/sms.controller';
// import { HttpModule, HttpService } from '@nestjs/axios';

import { generateCollectionProvider } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';
import { NotificationsController } from './controllers/notifications/notifications.controller';
import { NotificationService } from './services/notifications/notifications.service';
import { SmsModule } from './sms/sms.module';

const providers: any[] = [NotificationService, generateCollectionProvider(DatabaseCollectionEnums.NOTIFICATIONS)];

const imports: any[] = [
    SmsModule,
    // HttpModule,
];

const allExports = providers.concat(imports);
@Module({
    controllers: [SmsController, NotificationsController],
    providers,
    exports: allExports,
    imports,
})
export class NotificationsModule {

}
