/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { EmailsService } from './services/emails/emails.service';
import { GmailService } from './services/gmail/gmail.service';

const providers: any[] = [
  EmailsService,
  GmailService
];

const imports: any[] = [];

@Module({
  providers,
  imports,
  exports: providers.concat(imports),
})
@Global()
export class EmailsModule { }
