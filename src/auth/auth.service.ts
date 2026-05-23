import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly user: UsersService,
    private readonly jwtService: JwtService
  ) { }
  async registerUser(body) {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    body.password = hashedPassword;
    let result = await this.user.register(body);
    if (result.success) {
      const token = this.jwtService.sign({
        email: body.email,
        role: body.role
      })
      result["token"] = token;
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
      }
    }

    const res = await bcrypt.compare(
      body.password,
      us.password
    );

    if (!res) {
      return {
        success: false,
        message: "Invalid Password!"
      }
    }

    const token = this.jwtService.sign({
      email: us.email,
      role: us.role
    });

    return {
      success: true,
      message: "Login successful",
      token,
      user: us
    }
  }

}
