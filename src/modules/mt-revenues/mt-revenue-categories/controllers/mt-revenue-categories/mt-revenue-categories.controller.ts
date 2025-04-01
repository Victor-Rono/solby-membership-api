/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { BaseController } from 'src/modules/base/controllers/base/base.controller';
import { MtRevenueCategoriesService } from '../../services/mt-revenue-categories/mt-revenue-categories.service';

@Controller('mt-revenue-categories')
export class MtRevenueCategoriesController extends BaseController<any, any, any, any> {
    constructor(
        private service: MtRevenueCategoriesService,
    ) {
        super(service);
    }
}
