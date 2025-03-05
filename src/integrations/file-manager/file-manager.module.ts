/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { PdfService } from './services/pdf/pdf.service';

const providers = [PdfService];
const imports = [];


@Module({
  providers,
  imports,
  exports: providers.concat(imports),
})
@Global()
export class FileManagerModule { }
