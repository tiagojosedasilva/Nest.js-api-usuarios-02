import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseInterceptors } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";
import { LogInterceptor } from "src/interceptors/log.interceptor";
import { ParamId } from "src/decorators/param-id.decorator";

@UseInterceptors(LogInterceptor)
@Controller('/users')
export class UserController{

    constructor(private user: UserService){}

    @Get()
    async getAll(){
        return this.user.list();
    }
    @Post()
    async create(@Body() body: CreateUserDTO){
        return this.user.create(body);
    }
    @Get(':id')
    async getOne(@ParamId() id: number){
        console.log({id})
        return this.user.show(id);
    }
    @Patch(':id')
    async update(@ParamId() id: number, @Body() body: UpdateUserDto){
        return this.user.update(id, body)
    }
    @Delete(':id')
    async delete(@ParamId() id: number){
        return this.user.delete(id)
    }

}