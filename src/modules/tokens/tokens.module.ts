/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TokensService } from './services/tokens/tokens.service';
import { JwtModule } from 'src/INTEGRATIONS/jwt/jwt.module';

const imports: any[] = [JwtModule];
const providers: any[] = [TokensService];

@Module({
  providers,
  imports,
  exports: providers.concat(imports),
})
export class TokensModule { }
