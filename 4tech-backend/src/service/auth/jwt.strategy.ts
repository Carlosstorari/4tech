import { Injectable } from "@nestjs/common";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

//NUMCA DEVE SER EXPOSTA PULBLICAMENTE

/**A chave secreta só esta a mostra a fins de deixar claro o que
 * o código esta fazendo. Em um ambiente de produção, a chave
 * deve estar protegida por medidas apropriadas (como por exemplo
 * secret vaults, variaveis de ambiente e serviços de configuração)
 */
export const secretKey = 'wingardum leviosa'; 

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secretKey
        })
    }

    async validate(payload: any){
        return { userLogin: payload.userLogin };
    }
}