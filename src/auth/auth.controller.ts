import { Controller,Post,Body,Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}
    @Post("/register")
    register(@Body() body:RegisterDto){

        return this.authService.registerUser(body);
    }

    @Get("/users")
    getAllUsers()
    {
        return this.authService.findAllUser();
    }


}
