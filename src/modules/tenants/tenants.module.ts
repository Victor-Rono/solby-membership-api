/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { TenantsService } from './services/tenants/tenants.service';
import { TenantsAutomationService } from './services/tenants-automation/tenants-automation.service';
import { TenantsController } from './controllers/tenants/tenants.controller';
import { DatabaseCollectionEnums } from '../../database/database.interface';
import { generateCollectionProvider } from '../../database/database.functions';
import { UsersModule } from '../users/users.module';
import { PermissionsModule } from '../permissions/permissions.module';



const providers: any[] = [
  generateCollectionProvider(DatabaseCollectionEnums.TENANTS),
  TenantsService,

];

const imports: any[] = [
  PermissionsModule,
];


@Module({
  providers,
  imports,
  controllers: [TenantsController],
  exports: imports.concat(providers),
})

@Global()
export class TenantsModule { }
