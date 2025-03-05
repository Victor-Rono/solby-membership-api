/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule as JSonWebTokenModule, JwtService } from '@nestjs/jwt';
import { JwtConfig } from './jwt.config';
const providers: any[] = [JwtService];
const imports: any[] = [
    JSonWebTokenModule.register({
        secret: JwtConfig.secret,
        signOptions: JwtConfig.signOptions,
    }),
];

@Module({
    providers,
    imports,
    exports: providers.concat(imports),

})
export class JwtModule { }
