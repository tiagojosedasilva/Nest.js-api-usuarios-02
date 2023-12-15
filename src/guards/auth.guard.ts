import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class AuthGuards implements CanActivate{

    constructor(private authService: AuthService){}

    canActivate(context: ExecutionContext){
        const request = context.switchToHttp().getRequest();
        const {authorization} = request.headers;

        console.log({authorization})
        const token = (authorization ?? '').split(' ')[1];
        console.log(token)
        try{
            const data = this.authService.checkToken(token);
            request.token = token;

            return true;
        }catch{
            return false;
        }
    }

}