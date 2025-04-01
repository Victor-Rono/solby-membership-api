/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Headers, Get, Param } from '@nestjs/common';
import { BaseController, prepareRequest } from 'src/modules/base/controllers/base/base.controller';
import { MtPayrollService } from '../../services/mt-payroll/mt-payroll.service';

@Controller('mt-payroll')
export class MtPayrollController extends BaseController<any, any, any, any> {
    constructor(
        private readonly service: MtPayrollService
    ) {
        super(service);
    }

    @Post('generate')
    generatePayroll(@Headers() headers: any, @Body() body: any) {
        const payload = prepareRequest({ headers, payload: body });
        return this.service.generatePayroll(payload);
    }

    @Get('generate/:id')
    generatePayrollById(@Headers() headers: any, @Param('id') id: string) {
        const payload = prepareRequest({ headers, id });

        return this.service.generatePayrollById(payload);
        // const payload = prepareRequest({ headers, payload: body });
        // return this.service.generatePayroll(payload);
    }

    @Get('config/all')
    getPayroll(@Headers() headers: any) {
        const payload = prepareRequest({ headers });
        return this.service.getPayroll(payload.organizationId);
    }
}

