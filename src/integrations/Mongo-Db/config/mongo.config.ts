/* eslint-disable prettier/prettier */
import * as dotenv from 'dotenv';
dotenv.config();

export const MongoConfig = {
    user: process.env.MONGO_USER, // Replace with your desired username
    pwd: process.env.MONGO_PWD, // Replace with a strong password
    roles: [{ role: "root", db: process.env.MONGO_DATABASE }], // Full
    dbName: process.env.MONGO_DATABASE,
}

// export const MongoConfig = {
//     user: "alotofm!lkforEveryton3", // Replace with your desired username
//     pwd: "Saedadsdada3cusdlmkmdkladkwaidjlre!P!sasdd4444tyrrawwLLL<KKK>asdasw0rd2025", // Replace with a strong password
//     roles: [{ role: "root", db: "admin" }], // Full
//     dbName: 'admin',
// }







