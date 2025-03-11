/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongoDbModule } from 'src/integrations/Mongo-Db/mongo-db.module';
// import { FirebaseModule } from 'src/integrations/firebase/firebase.module';
// import { SmsModule } from 'src/modules/notifications/sms/sms.module';

// const imports: any[] = [FirebaseModule];


const imports: any[] = [MongoDbModule];
const providers: any[] = [DatabaseService];

const allExports = providers.concat(imports);


@Module({
  providers,
  imports,
  exports: allExports,
})
export class DatabaseModule { }
