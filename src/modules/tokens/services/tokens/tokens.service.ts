/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DefaultJWTOptions, JwtConfig } from 'src/integrations/jwt/jwt.config';

@Injectable()
export class TokensService {
    private privateKey = JwtConfig.secret;
    constructor(
        private readonly jwtService: JwtService
    ) { }

    /**
     * Generates a JWT token.
     * @param payload - The data to encode in the token.
     * @param expiresIn - (Optional) Token expiration time (e.g., '1h', '7d').
     * @returns A signed JWT token.
     */
    generateToken(payload: Record<string, any>, expiresIn?: string,): string {
        payload.secretOrPrivateKey = this.privateKey;
        const options = DefaultJWTOptions;

        // const options = expiresIn ? { expiresIn: expiresIn || '1h', } : {};
        return this.jwtService.sign(payload, options);
    }

    /**
     * Verifies the validity of a token.
     * @param token - The token to verify.
     * @returns The decoded payload if the token is valid.
     * @throws Error if the token is invalid or expired.
     */
    validateToken(token: string): any {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    /**
     * Decodes a token without verifying its signature.
     * @param token - The token to decode.
     * @returns The decoded payload.
     */
    decodeToken(token: string): any {
        return this.jwtService.decode(token);
    }

    /**
     * Generates an access token.
     * @param payload - The data to encode in the access token.
     * @returns A signed access token.
     */
    generateAccessToken(payload: Record<string, any>): string {
        return this.generateToken(payload, '15m'); // Default expiration for access token is 15 minutes.
    }

    /**
     * Generates a refresh token.
     * @param payload - The data to encode in the refresh token.
     * @returns A signed refresh token.
     */
    generateRefreshToken(payload: Record<string, any>): string {
        return this.generateToken(payload, '7d'); // Default expiration for refresh token is 7 days.
    }
}
