import { IsEnum, IsOptional, IsString } from "class-validator"
import { IsEmail, IsStrongPassword } from "class-validator"
import { Role } from "src/enums/role.enum";

export class CreateUserDTO{

    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsStrongPassword({
        minLength: 6
    })
    password: string;

    @IsOptional()
    role: number;
}
