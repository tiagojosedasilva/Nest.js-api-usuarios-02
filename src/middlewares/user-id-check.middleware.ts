import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class UserIdCheckMiddleware implements NestMiddleware{
    use(req: Request, res: any, next: NextFunction) {
        console.log('UserCheckMiddleware antes');
    
        if(isNaN(Number(req.params.id || Number(req.params.id) <= 0))){
            throw new BadRequestException('Id inválido!')
        }
    
        console.log('UserCheckMiddleware depois');
        next();
    }    
}