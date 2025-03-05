/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DatabaseCollectionEnums, DBRequestInterface } from 'src/database/database.interface';
import { BaseService } from 'src/modules/base/base.service';
import { DebtorInterface } from 'src/shared/interfaces/debtors.interface';
import { MT_SaleInterface } from 'src/shared/interfaces/MT-sales.interface';
import { PaymentIntervalEnum } from 'src/shared/interfaces/payment.interface';
import { getTotalForField } from 'victor-dev-toolbox';

@Injectable()
export class MtPayrollService extends BaseService<any, any, any, any> {
    constructor() {
        super();
    }

    override async create(data: DBRequestInterface) {
        const id = 'payroll';
        const { organizationId, payload } = data;
        payload.id = id;
        const payroll = await this.getById({ id, organizationId: data.organizationId });

        if (payroll) {
            return this.update({ id, organizationId, payload });
        } else {
            const payroll = await super.create({ id, organizationId, payload });
            return payroll;
        }
    }

    async getPayroll(organizationId: string) {
        const payroll = await this.getById({ id: 'payroll', organizationId });
        if (payroll) {
            return payroll;
        } else {
            const defaultData = { weekly: "Monday", biweekly: "Monday", monthly: "1", id: "payroll" };
            const payroll = await super.create({ id: 'payroll', organizationId, payload: defaultData });
            return payroll;

        }
    }


    async generatePayroll(data: DBRequestInterface) {
        const { payload, organizationId } = data;
        const { interval } = payload;
        const payroll = await this.preparePayrollByInterval(organizationId, interval);
        return payroll;
    }



    async generatePayrollById(payload: DBRequestInterface) {
        const { id, organizationId } = payload;
        const sales = await this.databaseService.getItemsByField({ organizationId, collection: DatabaseCollectionEnums.INVOICES, field: 'sellerId', value: id });

        return sales;

    }

    private async preparePayrollByInterval(organizationId: string, interval: PaymentIntervalEnum) {
        const payees = await this.databaseService.getItemsByField({ organizationId, collection: DatabaseCollectionEnums.DEBTORS, field: 'paymentInterval', value: interval });
        const sales = await this.databaseService.getItemsByField({ organizationId, collection: DatabaseCollectionEnums.INVOICES, field: 'buyerId', value: organizationId });
        const payroll = this.processPayrollForAllPayees({ payees, sales });
        return payroll;
    }

    private processPayrollForAllPayees(payload: { payees: DebtorInterface[], sales: MT_SaleInterface[] }) {
        const { payees, sales } = payload;
        const payroll: any[] = [];
        payees.forEach(p => {
            const singlePayroll = this.processSinglePayroll(p, sales);
            if (singlePayroll.balance) {
                payroll.push(singlePayroll);

            }
        })
        return payroll;
    }

    processSinglePayroll(payee: DebtorInterface, sales: MT_SaleInterface[]) {

        const filtered = sales.filter(s => s.sellerId === payee.id);

        const totalAmount = getTotalForField(filtered, 'totalAmount');
        const totalPaid = getTotalForField(filtered, 'amountPaid');
        const balance = totalAmount - totalPaid;
        const result: any = payee;
        result.balance = balance;
        return result;
    }


}
