/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MPesaController } from './controllers/m-pesa/m-pesa.controller';
import { MPesaService } from './services/m-pesa/m-pesa.service';

const providers: any[] = [MPesaService]

@Module({
  controllers: [MPesaController],
})
export class MPesaModule { }
