/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongoDbService } from './services/mongo-db/mongo-db.service';
import { MongooseModule } from '@nestjs/mongoose';
import { defaultMongoClient } from './functions/mongo.functions';

@Module({
    imports: [
        // MongooseModule.forRoot(mongoConnect()), // Remove duplicate authSource
        MongooseModule.forRootAsync({
            useFactory: () => ({
                uri: defaultMongoClient(),
            })
        })
    ],
    providers: [MongoDbService],
    exports: [MongoDbService], // Make sure the MongoDbService is exported if you want to use it in other modules
})
export class MongoDbModule { }
