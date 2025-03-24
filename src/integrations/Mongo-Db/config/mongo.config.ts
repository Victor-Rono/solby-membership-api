/* eslint-disable prettier/prettier */
import * as dotenv from 'dotenv';
dotenv.config();

// export const MongoConfig = {
//     user: process.env.MONGO_USER, // Replace with your desired username
//     pwd: process.env.MONGO_PWD, // Replace with a strong password
//     roles: [{ role: "root", db: process.env.MONGO_DATABASE }], // Full
//     dbName: process.env.MONGO_DATABASE,
// }

// export const MongoConfig = {
//     user: "doadmin", // Replace with your desired username
//     pwd: "1E04x259z6GdV7cY", // Replace with a strong password
//     roles: [{ role: "root", db: "admin" }], // Full
//     dbName: 'membership',
// }



// export const MongoConfig = {
//     user: "doadmin", // Admin user
//     pwd: "1E04x259z6GdV7cY", // Strong password
//     authSource: "admin", // Authenticate against the admin database
//     // auth: {
//     // },
//     dbName: "membership", // Target database
//     roles: [{ role: "root", db: "admin" }], // Full access
// };

export const MongoConfig = {
    user: "doadmin", // Admin user
    pwd: "A9bX7y24LmPqT3VZ", // Strong password
    authSource: "admin", // Authenticate against the admin database
    // auth: {
    // },
    dbName: "membership", // Target database
    roles: [{ role: "root", db: "admin" }], // Full access
};





