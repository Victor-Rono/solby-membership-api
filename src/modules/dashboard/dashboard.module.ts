/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { DashboardService } from './services/dashboard/dashboard.service';
import { DashboardController } from './controllers/dashboard/dashboard.controller';


const providers: any[] = [DashboardService];

const imports: any[] = [];
@Module({
  providers,
  controllers: [DashboardController],
  imports,
  exports: imports.concat(providers),
})
export class DashboardModule { }
