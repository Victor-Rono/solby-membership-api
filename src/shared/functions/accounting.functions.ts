/* eslint-disable prettier/prettier */
import { AccountingEnum, AccountInterface } from 'src/modules/accounting/accounting.interface';
import { generateUniqueId } from 'victor-dev-toolbox';

export function prepareAccount(payload: Partial<AccountInterface>): AccountInterface {
    const defaultAccount: AccountInterface = {
        id: generateUniqueId(),
        name: "Default Name",
        bankName: "N/A",
        bankBranch: "N/A",
        accountNumber: "000000",
        description: "",
        amount: 0,
        accountType: AccountingEnum.REVENUE, // Default value for account type
        createdBy: "SYSTEM",

    };

    const account = {
        ...defaultAccount, // Spread default values
        ...payload, // Override defaults with values from the payload
    };

    return account

}
