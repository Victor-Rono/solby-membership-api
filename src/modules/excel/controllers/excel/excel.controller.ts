/* eslint-disable prettier/prettier */
import { Controller, Get, Headers } from '@nestjs/common';
import { ExcelService } from '../../excel.service';

@Controller('excel')
export class ExcelController {
    constructor(
        private excelService: ExcelService) { }

    @Get('')
    saveAgrovet(@Headers() headers: any) {
        return this.excelService.execute();
    }
}
