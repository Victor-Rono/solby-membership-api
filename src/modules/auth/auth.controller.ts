/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Headers } from '@nestjs/common';
import { prepareRequest } from '../base/base.controller';
import { AuthService } from './services/auth/auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    @Get('send-otp/:userId')
    async sendOtp(@Param('userId') userId: string) {
        return await this.authService.sendOtp(userId);
    }

    @Post('verify-otp')
    async verifyOtp(@Body() body: any) {
        return await this.authService.verifyOtp(body);
    }

    @Post('verify-email')
    async verifyEmail(@Body() body: any, @Headers() headers: any) {
        const request = prepareRequest({ headers, payload: body })
        const payload = { email: request.payload.email, organizationId: request.organizationId }
        return await this.authService.verifyEmail(payload);
    }

    @Post('login')
    async login(@Body() body: any, @Headers() headers: any) {
        const payload = prepareRequest({ headers, payload: body })
        return await this.authService.login(payload);
    }

    @Get('validate-token/:id')
    async validateToken(@Param('id') id: string) {
        return await this.authService.validatePasswordUpdateToken(id);
    }

    @Post('reset-password')
    async resetPassword(@Body() body: any, @Headers() headers: any) {
        const payload = prepareRequest({ headers, payload: body })
        return await this.authService.resetPassword(payload);
    }

    @Post('update-password')
    async updatePassword(@Body() body: any, @Headers() headers: any) {
        const payload = prepareRequest({ headers, payload: body })
        return await this.authService.updatePassword(payload);
    }


}