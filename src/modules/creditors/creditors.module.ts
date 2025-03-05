/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { generateCollectionProvider } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';
import { CreditorsController } from './controllers/creditors/creditors.controller';
import { CreditorsService } from './services/creditors/creditors.service';



const providers: any[] = [CreditorsService,
    generateCollectionProvider(DatabaseCollectionEnums.CREDITORS)];
@Module({
    controllers: [CreditorsController],
    providers,
    exports: providers,
})
export class CreditorsModule { }
