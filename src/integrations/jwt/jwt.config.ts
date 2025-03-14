/* eslint-disable prettier/prettier */
import * as dotenv from 'dotenv';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

export const JwtConfig = {
    secret: jwtSecret,
    signOptions: { expiresIn: '10d' },
}


export const DefaultJWTOptions = {
    expiresIn: '1h', // Default to 1 hour if no expiration is specified
    secret: JwtConfig.secret,     // Provide the secret here
};

