/* eslint-disable prettier/prettier */
import { prepareAccount } from "src/shared/functions/accounting.functions";
import { AccountingEnum, AccountInterface, DefaultAccountEnums } from "../../accounting.interface";

export const VirtualAccounts: AccountInterface[] = [
    prepareAccount({ id: DefaultAccountEnums.FUNDS_RECEIVED, name: 'Added Funds', accountType: AccountingEnum.REVENUE, }),
    // prepareAccount({ id: DefaultAccountEnums.PETTY_CASH, name: 'Petty Cash', accountType: AccountingEnum.EXPENDITURE, }),
    prepareAccount({ id: DefaultAccountEnums.LIVESTOCK_DEATHS, name: 'Livestock Death', accountType: AccountingEnum.EXPENDITURE, }),
]