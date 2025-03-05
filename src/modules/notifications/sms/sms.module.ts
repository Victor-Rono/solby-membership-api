/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { SmsService } from './services/sms/sms.service';
import { LancolaSmsModule } from 'src/INTEGRATIONS/lancola-sms/lancola-sms.module';
import { DatabaseModule } from 'src/database/database.module';

const imports: any[] = [LancolaSmsModule, DatabaseModule];
const providers: any[] = [SmsService];

@Global()
@Module({
  providers,
  imports,
  exports: imports.concat(providers),
})
export class SmsModule { }
