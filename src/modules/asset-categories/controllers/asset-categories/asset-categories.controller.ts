/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { BaseController } from 'src/modules/base/controllers/base/base.controller';
import { AssetCategoriesService } from '../../services/asset-categories/asset-categories.service';

@Controller('asset-categories')
export class AssetCategoriesController extends BaseController<any, any, any, any> {
    constructor(
        private service: AssetCategoriesService
    ) {
        super(service);
    }

}
