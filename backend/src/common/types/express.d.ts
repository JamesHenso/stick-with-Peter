export interface JwtPayloadUser{
    id: string;
}

declare global{
    namespace Express{
        interface Request{
            user?: JwtPayloadUser
        }
    }
}