/* eslint-disable prettier/prettier */
import { Controller, Get, Headers, Param } from '@nestjs/common';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { prepareRequest } from '../../../base/base.controller';
import { MembershipDashboardService } from '../../services/membership-dashboard/membership-dashboard.service';

@Controller('dashboard')
export class DashboardController {

    constructor(
        private dashboardService: DashboardService,
        private membershipDashboardService: MembershipDashboardService
    ) { }

    @Get('')
    dashboardData(@Headers() headers: any) {
        const request = prepareRequest({ headers });
        const organizationId = request.organizationId;
        return this.dashboardService.getDashboardData(organizationId);
    }

    @Get('latest')
    latestDashboardData(@Headers() headers: any) {
        const request = prepareRequest({ headers });
        const organizationId = request.organizationId;
        return this.dashboardService.getLatestDashboardData(organizationId);
    }

    @Get('member')
    getMemberDashboard(@Headers() headers: any) {
        const request = prepareRequest({ headers });
        return this.membershipDashboardService.getDashboard(request);

    }



}
