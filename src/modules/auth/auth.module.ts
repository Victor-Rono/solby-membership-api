/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { generateCollectionProvider } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';
import { TokensModule } from '../tokens/tokens.module';
import { AuthService } from './services/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, generateCollectionProvider(DatabaseCollectionEnums.AUTH)],
  imports: [TokensModule, JwtModule],

})
export class AuthModule { }
