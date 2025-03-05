/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { BaseController } from 'src/modules/base/base.controller';
import { NotificationService } from '../../services/notifications/notifications.service';

@Controller('notifications')
export class NotificationsController extends BaseController<any, any, any, any> {
    constructor(private readonly service: NotificationService) {
        super(service)
    }
}
