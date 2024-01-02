import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaService } from "src/infraestrutura/prisma/prisma.service";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt';
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class AuthService{

    private issuer = 'login';
    private audience = 'users';

    constructor( 
        private readonly jwtService: JwtService, 
        private prismaService: PrismaService,
        private userService: UserService,
        private readonly mailer: MailerService
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
            }
        });

        if(!await bcrypt.compare(password, user.password)){
            throw new UnauthorizedException('Email e/ou senha incorretos');
        }

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
        
        const token = this.jwtService.sign({
            id: user.id
        },{
            expiresIn: "30 minutes",
            subject: String(user.id),
            issuer: 'forget',
            audience: 'users'
        });

        await this.mailer.sendMail({
            subject: 'Recuperação de senha!',
            to: 'tiago@silva.com.br',
            template: 'forget',
            context: {
                name: user.name,
                token
            }
        })
        return true;
    }
    
    async reset(password: string, token: string){
        try {
            const data: any = this.jwtService.verify(token, {
                issuer: 'forget',
                audience: 'users'
            });

            if(isNaN(Number(data.id))){
                throw new BadRequestException("Token inválido!")
            }

            const salt = await bcrypt.genSalt()
            password = await bcrypt.hash(password, salt)

            const id = 0;
            const user = await this.prismaService.user.update({
                where: {
                    id: Number(data.id),
                },
                data:{
                    password,
                }
            })
            console.log(user)
            return this.createToken(user)

        } catch (error) {
            throw new BadRequestException(error)
        }
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