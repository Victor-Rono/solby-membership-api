/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { BaseController } from 'src/modules/base/base.controller';
import { GroupsService } from '../../services/groups/groups.service';

@Controller('groups')
export class GroupsController extends BaseController<any, any, any, any> {
    constructor(private readonly service: GroupsService) {
        super(service);
    }
}
