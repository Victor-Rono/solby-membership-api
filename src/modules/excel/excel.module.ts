/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ExcelController } from './controllers/excel/excel.controller';
import { HttpModule } from '@nestjs/axios';
import { ExcelService } from './excel.service';

@Module({
  controllers: [ExcelController],
  providers: [ExcelService],
})
export class ExcelModule { }
