import { Controller, Post, Body, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @Post("/register")
    register(@Body() body: RegisterDto) {

        return this.authService.registerUser(body);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get("/users")
    getAllUsers() {
        return this.authService.findAllUser();
    }

    @Post("/login")
    getUser(@Body() body: LoginDto) {
        // console.log("body:",body.email);
        return this.authService.findUser(body)
        // return body;
    }

    @Post("/refresh")
    refresh(@Body() body: any) {

        return this.authService.refreshToken(
            body.refreshToken
        );
    }



}
