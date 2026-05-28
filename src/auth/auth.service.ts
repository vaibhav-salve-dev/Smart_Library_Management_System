import {
  Injectable,
  UnauthorizedException
} from '@nestjs/common';

import { UsersService } from '../users/users.service';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private readonly user: UsersService,
    private readonly jwtService: JwtService
  ) {}

  generateAccessToken(user: any) {

    return this.jwtService.sign(
      {
        email: user.email,
        role: user.role
      },
      {
        expiresIn: '15m'
      }
    );
  }


  generateRefreshToken(user: any) {

    return this.jwtService.sign(
      {
        email: user.email,
        role: user.role
      },
      {
        expiresIn: '7d'
      }
    );
  }

  async registerUser(body) {

    const hashedPassword =
      await bcrypt.hash(body.password, 10);

    body.password = hashedPassword;

    let result =
      await this.user.register(body);

    if (result.success) {

      const accessToken =
        this.generateAccessToken(body);

      const refreshToken =
        this.generateRefreshToken(body);

      result["accessToken"] =
        accessToken;

      result["refreshToken"] =
        refreshToken;
    }

    return result;
  }

  findAllUser() {

    return this.user.findAll();

  }

  async findUser(body) {

    let target =
      await this.user.findByEmail(body.email);

    if (!target.success) {

      return target;

    }

    const us = target.user;

    if (!us) {

      return {
        success: false,
        message: "User not found"
      };
    }

    const res =
      await bcrypt.compare(
        body.password,
        us.password
      );

    if (!res) {

      return {
        success: false,
        message: "Invalid Password!"
      };
    }

    const accessToken =
      this.generateAccessToken(us);

    const refreshToken =
      this.generateRefreshToken(us);

    return {

      success: true,

      message: "Login successful",

      accessToken,

      refreshToken,

      user: us

    };
  }

 
  async refreshToken(refreshToken: string) {

    try {

      const payload =
        this.jwtService.verify(
          refreshToken,
          {
            secret: process.env.secret
          }
        );

      const newAccessToken =
        this.generateAccessToken(payload);

      return {
        success: true,
        accessToken: newAccessToken
      };

    } catch (error) {

      throw new UnauthorizedException(
        "Invalid refresh token"
      );
    }
  }
}