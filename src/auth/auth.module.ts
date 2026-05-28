import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

import { UsersModule } from '../users/users.module';

import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from './jwt.strategy';

@Module({

  imports: [

    UsersModule,

    JwtModule.registerAsync({

      useFactory: () => ({

        secret: process.env.secret,

      }),

    }),

  ],

  controllers: [
    AuthController
  ],

  providers: [
    AuthService,
    JwtStrategy
  ],

})

export class AuthModule {}