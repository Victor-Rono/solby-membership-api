/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { readExcel } from './excel.functions';
@Injectable()
export class ExcelService {
    constructor(
        private databaseService: DatabaseService,
    ) {

    }


    async execute() {
        const excelData = await readExcel();

        return this.processData(excelData);
        // this.updateLivestockDates('');

    }

    async processData(excelData: any[]) {

    }







}



