/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { getDaysInMonth } from 'date-fns';
import { DatabaseCollectionEnums, DBRequestInterface } from 'src/database/database.interface';
import { DatabaseService } from 'src/database/database.service';
import { InvoiceInterface } from 'src/modules/invoices/invoices.interface';
import { MembersService } from 'src/modules/members/services/members/members.service';
import { PieChartInterface } from 'src/shared/interfaces/apex.interface';
import { MemberInterface, MembersDashboardInterface, MemberStatusEnum } from 'src/shared/interfaces/members.interface';
import { filterByDateRange, getFirstDayOfTheMonthUntilToday, getItemsCreatedToday, getItemsWithinDateRange, getTotalForField, jumpToXNumberOfDays } from 'victor-dev-toolbox';
// const collection = DatabaseCollectionEnums.
@Injectable()
export class MembershipDashboardService {
    constructor(
        private databaseService: DatabaseService,
        private membersService: MembersService,
    ) { }

    async getDashboard(payload: DBRequestInterface): Promise<MembersDashboardInterface> {
        const { organizationId } = payload;
        const members: MemberInterface[] = await this.membersService.getAll(organizationId);
        const activeMembers = members.filter(m => m.status === MemberStatusEnum.ACTIVE);
        const inactiveMembers = members.filter(m => m.status === MemberStatusEnum.INACTIVE);
        const startDate = jumpToXNumberOfDays({ daysToJump: -365 });
        const today = new Date().toISOString()
        const stopDate = jumpToXNumberOfDays({ startDate: today, daysToJump: 10 })

        const invoices = await this.databaseService.getItemsByDateRange({ organizationId, collection: DatabaseCollectionEnums.INVOICES, startDate, stopDate });
        const dateRange = getFirstDayOfTheMonthUntilToday();
        const thisMonthInvoices = await getItemsWithinDateRange({ dateRange, fieldToCheck: 'createdAt', items: invoices });
        const revenueThisMonth = getTotalForField(thisMonthInvoices, 'amountPaid');
        const todayInvoices = getItemsCreatedToday(invoices, 'createdAt')
        const revenueToday = getTotalForField(todayInvoices, 'amountPaid');



        const membershipPieChart: PieChartInterface = {
            labels: ['Active Members', 'Inactive Members',],
            series: [activeMembers.length, inactiveMembers.length],
        }

        const newMembersThisMonth = await this.getMembersThisMonth(members);

        const dashboard: MembersDashboardInterface = {
            activeMembers: activeMembers.length,
            inactiveMembers: inactiveMembers.length,
            newMembersThisMonth,
            totalMembers: members.length,
            revenueThisMonth,
            // revenueCollectedBarChart: BarChartInterface,
            membershipPieChart,
            revenueToday,

        }
        return dashboard
    }




    private async getRevenue() {
        const dateRange = getFirstDayOfTheMonthUntilToday()
    }
    private async getMembersThisMonth(members: MemberInterface[]) {
        const dateRange = getFirstDayOfTheMonthUntilToday();
        const filtered = await getItemsWithinDateRange({ dateRange, items: members, fieldToCheck: 'createdAt' });
        return filtered.length;

    }

    // prepareBarChart(invoices: InvoiceInterface[]) {
    //     const dateRange = getFirstDayOfTheMonthUntilToday();

    //     let firstDay = new Date(dateRange.startDate).toISOString();
    //     const daysToJump = getDaysInMonth(firstDay);
    //     const lastDay = jumpToXNumberOfDays({ startDate: firstDay, daysToJump });
    //     const previousMonth = jumpToXNumberOfDays({ startDate: firstDay, daysToJump });
    // }
}
