import { Body, Controller, Post, Headers, UseGuards, Req, UseInterceptors, UploadedFile, BadRequestException, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from "@nestjs/common";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthForgetDTO } from "./dto/auth-forget.dto";
import { AuthResetDTO } from "./dto/auth-reset.dto";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import { AuthGuards } from "src/guards/auth.guard";
import { User } from "src/decorators/user.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { join } from "path";
import { FileService } from "src/file/file.service";


@Controller('auth')
export class AuthController{

    constructor(
        private readonly userSevice: UserService,
        private readonly authService: AuthService,
        private readonly fileService: FileService,
    ){}

    @Post('login')
    async login(@Body() {email, password}: AuthLoginDTO){
        return this.authService.login(email, password)
    }

    @Post('register')
    async register(@Body() body: AuthRegisterDTO){
        return this.authService.register(body)
    }

    @Post('forget')
    async forget(@Body() {email}: AuthForgetDTO){
        return this.authService.forget(email)
    }

    @Post('reset')
    async reset(@Body() {password, token}: AuthResetDTO){
        return this.authService.reset(password, token)
    }

    @UseGuards(AuthGuards)
    @Post('me')
    async me(@User('email') user){
        //return token
        return {user};
    }

    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuards)
    @Post('photo')
    async photo(
        @User('email') user, 
        @UploadedFile(new ParseFilePipe({
            validators: [
                new FileTypeValidator({fileType: 'image/png'}),
                new MaxFileSizeValidator({maxSize: 1024 * 40})
            ]
        })) photo: Express.Multer.File){
        //return token
;
        const result = join(__dirname, '..','..', 'storage', 'photos', `photo-${user.id}.png`); 
        try {
            await this.fileService.upload(photo, result);
        } catch (error) {
            throw new BadRequestException(error)
        }
        return 'success'
    }
}
