import { cloneDeep } from 'lodash';
/* eslint-disable prettier/prettier */
import { PayrollCalculationsInterface, PayrollInterface } from "../interfaces/payroll.interface";
import { mergeObjects } from 'victor-dev-toolbox';



export function generatePaymentData(payroll: Partial<PayrollInterface>, data: PayrollCalculationsInterface) {

    const {
        quantity,
        grossPay,
        transport,
        advance,
        agrovet,
        netPay,
    } = data;

    const newNetPay = grossPay - (transport + advance + agrovet);
    data.netPay = newNetPay;
    const clonedPayroll: Partial<PayrollInterface> = cloneDeep(payroll);

    const mergedObject = mergeObjects(clonedPayroll, data);

    return mergedObject;
    // clonedPayroll.advance = advance;
    // clonedPayroll.grossPay = grossPay;
    // clonedPayroll.transport = transport;
    // clonedPayroll.quantity = quantity;

}