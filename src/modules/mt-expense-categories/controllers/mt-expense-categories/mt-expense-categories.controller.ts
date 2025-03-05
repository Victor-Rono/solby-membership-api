/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { BaseController } from 'src/modules/base/base.controller';
import { MtExpenseCategoriesService } from '../../services/mt-expense-categories/mt-expense-categories.service';

@Controller('mt-expense-categories')
export class MtExpenseCategoriesController extends BaseController<any, any, any, any> {
    constructor(
        private readonly service: MtExpenseCategoriesService,
    ) {
        super(service);
    }
}
