import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { PrismaModule } from "src/infraestrutura/prisma/prisma.module";
import { AuthService } from "./auth.service";
import { AuthGuards } from "src/guards/auth.guard";


@Module({
    imports: [ JwtModule.register({
        secret: "3PDr8hYPZp;jh]u`+N7o+]3ui>Z{*?us"
    }), UserModule, PrismaModule ],
    providers: [ AuthService ],
    controllers: [ AuthController ],
    exports: [ ]
})
export class AuthModule{}