import config from '../config';
import { TokenPayload } from '../config/types';
import jwt from 'jsonwebtoken';
import { InvalidTokenException, TokenExpiredException } from '../util/exceptions/AuthenticationException';
import { ServiceException } from '../util/exceptions/ServiceException';

export class AuthenticationService {
    constructor (
        private secretKey = config.auth.secretKey,
        private tokenExpiration = config.auth.tokenExpiration
    ) { }
    
    generateToken(userId:string): string {
        return jwt.sign(
            {userId},
            this.secretKey,
            {expiresIn: this.tokenExpiration}
        )
    }

    verify(token: string): TokenPayload {
        try {
            return jwt.verify(token, this.secretKey) as TokenPayload;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new TokenExpiredException();
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new InvalidTokenException();
            }
            throw new ServiceException('Invalid token');
        }
    }

    clear() {
        // TODO
    }
}