import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service'


@Injectable()
export class AuthService {
  constructor(private readonly user:UsersService){}
  registerUser(body)
  {
    return this.user.register(body);
  }

  findAllUser()
  {
    return this.user.findAll();
  }
    
}
