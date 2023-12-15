import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { PrismaService } from './infraestrutura/prisma/prisma.service';
import { UserIdCheckMiddleware } from './middlewares/user-id-check.middleware';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [ AuthModule ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, PrismaService],
})

export class AppModule implements NestModule{

  configure(consumer: MiddlewareConsumer) {
      consumer.apply(UserIdCheckMiddleware).forRoutes(UserController)
  }
}
