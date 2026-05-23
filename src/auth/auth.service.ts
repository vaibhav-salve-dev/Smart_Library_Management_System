import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly user:UsersService,
    private readonly jwtService:JwtService
  ){}
  async registerUser(body)
  {
    const hashedPassword = await bcrypt.hash(body.password,10);
    body.password=hashedPassword;
    let result=await this.user.register(body);
    if(result.success)
    {
      const token = this.jwtService.sign({
         email:body.email,
         role:body.role
      })
      result["token"]=token;
    }
    return result;
  }

  findAllUser()
  {
    return this.user.findAll();
  }

  async findUser(body)
  {
    let target = await this.user.findByEmail(body.email)
  console.log("tar:",target);
  if(!target.success)
  {
    return target;
  }

    
    const us=target.user;
    if(us)
    {
      const res=await bcrypt.compare(body.password,us.password);
    console.log("resss :",res);
    if(!res)
    {
      return {
        success:false,
        message:"Invalid Password !"
      }
    }
    }
    
    return target;
  
  }
    
}
