import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";
import { LogInterceptor } from "src/interceptors/log.interceptor";
import { ParamId } from "src/decorators/param-id.decorator";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";
import { RoleGuard } from "src/guards/role.guars";
import { AuthGuards } from "src/guards/auth.guard";


@UseGuards(AuthGuards, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('/users')
export class UserController{

    constructor(private user: UserService){}

    @Roles(Role.Admin)
    @Get()
    async getAll(){
        return this.user.list();
    }

    @Roles(Role.Admin)
    @Post()
    async create(@Body() body: CreateUserDTO){
        body.role = +body.role
        return this.user.create(body);
    }

    @Roles(Role.Admin)
    @Get(':id')
    async getOne(@ParamId() id: number){
        console.log({id})
        return this.user.show(id);
    }

    @Roles(Role.Admin)
    @Patch(':id')
    async update(@ParamId() id: number, @Body() body: UpdateUserDto){
        return this.user.update(id, body)
    }

    @Roles(Role.Admin)
    @Delete(':id')
    async delete(@ParamId() id: number){
        return this.user.delete(id)
    }

}