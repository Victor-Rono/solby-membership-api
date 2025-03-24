/* eslint-disable prettier/prettier */
import { MongoConfig } from "../config/mongo.config";

export function defaultMongoClient() {
    if (!MongoConfig || !MongoConfig.user || !MongoConfig.pwd || !MongoConfig.dbName) {
        throw new Error('MongoConfig is missing required properties.');
    }
    const connect = `mongodb://${MongoConfig.user}:${MongoConfig.pwd}@localhost:27017/${MongoConfig.dbName}?authSource=admin`;

    // const connect = `mongodb://${MongoConfig.user}:${MongoConfig.pwd}@localhost:27017/${MongoConfig.dbName}`;

    // const connect = process.env.MONGODB_URI;

    return connect;
}

// export function mongoConnect() {
//     if (!MongoConfig || !MongoConfig.user || !MongoConfig.pwd || !MongoConfig.dbName) {
//         throw new Error('MongoConfig is missing required properties.');
//     }

//     // Simplified connection string
//     const connect = `mongodb://${MongoConfig.user}:${MongoConfig.pwd}@localhost:27017/${MongoConfig.dbName}`;
//     return connect;
// }


// export function getMongoConfig(payload: { model: any, schema: any }) {
//     const { model, schema } = payload;
//     return [
//         {
//             name: model.name,
//             schema: schema,
//         },
//         // Add more models dynamically if needed
//     ];
// }

