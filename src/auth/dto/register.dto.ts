import { IsEmail, IsString, Matches, MinLength, IsIn } from 'class-validator';

export class RegisterDto{
    @IsString()
    @Matches(/^[A-Za-z ]+$/)
    name!:string;

    @IsEmail()
    email!:string;
    
    @MinLength(6)
    password!:string;

    @IsIn(['admin','member'])
    role!:string
}