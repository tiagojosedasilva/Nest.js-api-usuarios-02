import { IsJWT, IsString, MinLength } from "class-validator";
import { AuthForgetDTO } from "./auth-forget.dto";

export class AuthResetDTO{

    @IsString()
    @MinLength(6)
    password: string;

    @IsJWT()
    token: string;
}