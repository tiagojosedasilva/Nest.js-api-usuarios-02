import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaService } from "src/infraestrutura/prisma/prisma.service";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService{

    private issuer = 'login';
    private audience = 'users';

    constructor( 
        private readonly jwtService: JwtService, 
        private prismaService: PrismaService,
        private userService: UserService
    ){}

    createToken(user: User){
        return {
            accessToken: this.jwtService.sign({
                id: user.id,
                name: user.name,
                email: user.email,
            },{
                expiresIn: "7 days",
                subject: String(user.id),
                issuer: this.issuer,
                audience: this.audience
            })
        }
    }

    checkToken(token: string){
        try{ 
            return this.jwtService.verify(token, {
                issuer: this.issuer,
                audience: this.audience
            })
        } catch (e){
            throw new BadRequestException('Eu não queria dizer, mas tem alguma coisa certa nesse token errado!!')
        }
    }

    async login(email: string, password: string){
        const user = await this.prismaService.user.findFirst({
            where: {
                email,
                password
            }
        });
        if(!user){
            throw new UnauthorizedException('Email e/ou senha incorretos');
        }
        return this.createToken(user);
    }

    async forget(email: string){
        const user = await this.prismaService.user.findFirst({
            where: {
                email
            }
        });
        if(!user){
            throw new UnauthorizedException('Email incorreto!');
        }
        //enviar email;
        return true;
    }
    
    async reset(password: string, token: string){
        //TO DO: validar token...
        const id = 0;
        const user = await this.prismaService.user.update({
            where: {
                id,
            },
            data:{
                password,
            }
        })
        return this.createToken(user)
    }

    async register(data: AuthRegisterDTO){
        const user = await this.userService.create(data);
        return this.createToken(user);
    }

    isValidToken(token: string){
        try{ 
            this.checkToken(token)
            return true
        } catch (e){
            return false
        }
    }
    
}