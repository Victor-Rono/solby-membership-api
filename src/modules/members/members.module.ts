/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MembersService } from './services/members/members.service';
import { MembersAutomationService } from './services/members-automation/members-automation.service';
import { MembersController } from './controllers/members/members.controller';
import { FarmersModule } from '../farmers/farmers.module';
import { generateCollectionProvider } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';

const imports: any[] = [];
const providers: any[] = [MembersService, MembersAutomationService, generateCollectionProvider(DatabaseCollectionEnums.MEMBERS)];

@Module({
  providers,
  imports,
  controllers: [MembersController],
  exports: imports.concat(providers),
})
export class MembersModule { }
