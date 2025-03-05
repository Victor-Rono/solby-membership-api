/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { InvoicesController } from './controllers/invoice/invoices.controller';

import { generateCollectionProvider } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';
import { InvoiceManagerService } from './services/invoice-manager/invoice-manager.service';
import { InvoiceManagerController } from './controllers/invoice-manager/invoice-manager.controller';
import { InvoicesService } from './services/invoice/invoices.service';

const providers: any[] = [
  InvoicesService,
  InvoiceManagerService,
  generateCollectionProvider(DatabaseCollectionEnums.INVOICES),
];

const imports: any[] = [

];



@Module({
  providers,
  controllers: [InvoicesController, InvoiceManagerController],
  imports,
  exports: imports.concat(providers),
})
@Global()
export class InvoicesModule { }
