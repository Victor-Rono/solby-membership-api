/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { GroupsService } from './services/groups/groups.service';
import { GroupsAutomationService } from './services/groups-automation/groups-automation.service';
import { GroupsController } from './controllers/groups/groups.controller';
import { generateCollectionProvider } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';
import { MembersService } from '../members/services/members/members.service';
import { MembersModule } from '../members/members.module';

const providers: any[] = [GroupsService, GroupsAutomationService, generateCollectionProvider(DatabaseCollectionEnums.GROUPS)];
const imports: any[] = [MembersModule];



@Module({
  providers,
  imports,
  controllers: [GroupsController],
  exports: providers.concat(imports)
})
export class GroupsModule { }
