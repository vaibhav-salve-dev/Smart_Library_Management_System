import { Controller,Post,Body,Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}
    @Post("/register")
    register(@Body() body){
        return this.authService.registerUser(body);
    }

    @Get("/users")
    getAllUsers()
    {
        return this.authService.findAllUser();
       
    }


}
