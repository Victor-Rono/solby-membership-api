/* eslint-disable prettier/prettier */
import { UnitEnums } from "src/shared/enums/units.enums";
import { ProductInterface } from "src/shared/interfaces/product.interface";
import { jumpToXNumberOfDays } from "victor-dev-toolbox";

export function generateProductFromName(name: string) {
    const id = name.trim().toLowerCase();
    const product: ProductInterface = {
        id,
        name: name.toUpperCase(),
        // category: name,
        buyingPrice: 40,
        unitPrice: 60,
        units: UnitEnums.LITRES,
        description: name,
        quantity: 0,
        createdBy: 'SYSTEM',
        createdAt: new Date().toISOString(),
        expiryDate: 'n/a',
    };
    return product;
}