/* eslint-disable prettier/prettier */
export const JwtConfig = {
    secret: '28746328746372637528423463287432482938423984324837294869832438294325764873275432874783298432786453276984678',
    signOptions: { expiresIn: '10d' },
}


export const DefaultJWTOptions = {
    expiresIn: '1h', // Default to 1 hour if no expiration is specified
    secret: JwtConfig.secret,     // Provide the secret here
};