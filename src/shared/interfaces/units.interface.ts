/* eslint-disable prettier/prettier */
export type UnitTypesLong =
    | 'litres'
    | 'milliliters'
    | 'kilograms'
    | 'grams'
    | 'miligrams';
export type UnitTypesShort = 'L' | 'ml' | 'Kg' | 'g' | 'mg';
export interface UnitsInterface {
    short: UnitTypesShort;
    long: UnitTypesLong;
    SI: number;
    description: string;
    type: 'weight' | 'volume';
}

export interface MeasurementInterface {
    quantity: number;
    units: UnitsInterface;
}
