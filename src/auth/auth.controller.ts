import { Controller, Post, Body, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RateLimitGuard } from '../common/guards/login_throttler.guard';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
   
    @ApiOperation({
        summary: 'Register user'
    })
    @Post("/register")
    register(@Body() body: RegisterDto) {

        return this.authService.registerUser(body);
    }

    @ApiOperation({
        summary: 'login user'
    })
    @UseGuards(RateLimitGuard)
    @Post("/login")
    getUser(@Body() body: LoginDto) {
        // console.log("body:",body.email);
        return this.authService.findUser(body)
        // return body;
    }

    @ApiOperation({
        summary: 'Refresh the access token to avoid authorization issue'
    })
    @Post("/refresh")
    refresh(@Body() body: any) {

        return this.authService.refreshToken(
            body.refreshToken
        );
    }



}
