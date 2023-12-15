import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { PrismaService } from "src/infraestrutura/prisma/prisma.service";
import { Prisma, User } from "@prisma/client";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService{

    constructor(private prisma: PrismaService){}

    async create({name, email, password}: CreateUserDTO){

        return this.prisma.user.create({
            data: {
                name,
                email,
                password
            } as Prisma.UserCreateInput
        })
    }

    async list(){
        return this.prisma.user.findMany()
    }

    async show(id: number){
        return this.prisma.user.findUnique({
            where: {
                id
            }
        });
    }
    async delete(id: number){
        this.ifNotExists(id)
        return this.prisma.user.delete({
            where: {
                id
            }
        });
    }
    async update(id: number, data: UpdateUserDto){
        this.ifNotExists(id)
        return this.prisma.user.update({
            data,
            where: {
                id
            }
        })
    }
    async ifNotExists(id: number) {
        if(!(await this.show(id))){
            throw new NotFoundException("Usuário não encontrado!")
        }
    }
}
