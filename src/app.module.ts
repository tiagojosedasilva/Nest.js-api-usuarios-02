import { MiddlewareConsumer, Module, NestModule, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { PrismaService } from './infraestrutura/prisma/prisma.service';
import { UserIdCheckMiddleware } from './middlewares/user-id-check.middleware';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [ ConfigModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 5
    }]), forwardRef(() => AuthModule), 
    forwardRef(() => UserModule
    )],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, PrismaService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
})

export class AppModule implements NestModule{

  configure(consumer: MiddlewareConsumer) {
      consumer.apply(UserIdCheckMiddleware).forRoutes(UserController)
  }
}
