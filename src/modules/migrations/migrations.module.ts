import { Module } from '@nestjs/common';
import { MigrationsService } from './migrations.service';
import { MigrationsController } from './migrations.controller';
// import { RtdbService } from 'src/INTEGRATIONS/firebase/services/rtdb/rtdb.service';

@Module({
  controllers: [MigrationsController],
  // providers: [MigrationsService, RtdbService],
  providers: [MigrationsService],
  imports: [],
})
export class MigrationsModule { }
