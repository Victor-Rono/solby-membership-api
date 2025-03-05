/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Headers, Param, Post, Put } from '@nestjs/common';
import { BaseController, prepareRequest } from 'src/modules/base/base.controller';
import { UsersService } from '../../services/users/users.service';


@Controller('users')
export class UsersController extends BaseController<any, any, any, any> {
    constructor(private userService: UsersService) {
        super(userService);
    }

    @Get('organization/all')
    async getAll(@Headers() headers: any) {
        const payload = prepareRequest({ headers });

        const users = await this.userService.getOrgUsers({ organizationId: payload.organizationId });

        return users;
    }


    @Post('register-user')
    registerUser(@Headers() headers: any, @Body() payload: any) {
        const organizationId: string | null = headers['organizationid'] || null;
        payload.organizationId = organizationId;
        return this.userService.registerUser(payload);
    }

    @Get('remove-user/:id')
    removeUser(@Headers() headers: any, @Body() payload: any, @Param('id') id: string) {
        {
            const data = prepareRequest({ headers, payload, id })
            return this.userService.deleteUser({ userId: id, organizationId: data.organizationId });
        }
    }

    @Get('permissions/:id')
    getPermissions(@Headers() headers: any, @Param('id') id: string) {
        const payload = prepareRequest({ headers, id });
        return this.userService.getUserPermissions(payload);
    }


    @Get('all/update')
    async getAllCount(@Headers() headers: any) {
        const payload = prepareRequest({ headers });
        const users = await this.userService.updateAllUserIds();
        return users
    }
}

