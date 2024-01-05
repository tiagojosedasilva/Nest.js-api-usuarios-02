import { Test, TestingModule } from "@nestjs/testing"
import { UserService } from "./user.service"
import { beforeEach } from "node:test";
import { PrismaService } from "../infraestrutura/prisma/prisma.service";

describe('UserService', () => {

    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers:[ UserService, {
                provide: PrismaService,
                useValue: {
                    user:{
                        findUnique: jest.fn(),
                    }
                }
            } ],
        }).compile();

        userService = module.get<UserService>(UserService);

    })
    test('Validar a definição', () => {
        expect(userService).toBeDefined();
    });
})