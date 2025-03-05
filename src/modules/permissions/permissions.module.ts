/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { PermissionsController } from './controller/permissions/permissions.controller';

import { generateCollectionProvider } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';
import { PermissionsService } from './services/permissions/permissions.service';
import { UsersModule } from '../users/users.module';

const providers: any[] = [
  PermissionsService,
  generateCollectionProvider(DatabaseCollectionEnums.PERMISSIONS)
];

const imports: any[] = [
  UsersModule,
];




@Module({
  providers,
  imports,
  controllers: [PermissionsController],

  exports: providers.concat(imports),


})
@Global()
export class PermissionsModule { }
