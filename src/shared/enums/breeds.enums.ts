/* eslint-disable prettier/prettier */
export enum DairyBreedEnums {
    AYRSHIRE = 'AYRSHIRE',
    GUERNSEY = 'GUERNSEY',
    JERSEY = 'JERSEY',
    HOLSTEIN = 'HOLSTEIN',
    FRIESIAN = 'FRIESIAN',

}
export enum BeefBreedEnums {
    CHARHOLAIS = 'CHARHOLAIS',
    WAGYU = 'WAGYU',
    BORAN = 'BORAN',

}

export enum UngroupedBreedsEnum {
    UNKNOWN = 'UNKNOWN',
    CROSSBREED = 'CROSSBREED',
    OTHER = 'OTHER',
}
export type BreedEnum = DairyBreedEnums | BeefBreedEnums | UngroupedBreedsEnum;
