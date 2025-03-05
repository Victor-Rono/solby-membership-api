/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { generateCollectionProvider } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';
import { UsersService } from './services/users/users.service';



const providers: any[] = [
    UsersService,
    generateCollectionProvider(DatabaseCollectionEnums.USERS)
];

const imports: any[] = [];


@Module({
    imports,
    controllers: [UsersController],
    providers,

    exports: providers.concat(imports),
})
@Global()
export class UsersModule { }
