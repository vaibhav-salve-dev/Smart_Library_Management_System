import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private userModel:Model<User>
    ){}
    async register(body) {
    try{
      let result=await this.userModel.create(body);
      return {
        success:true,
        message:"User created successfully",
        user:result
      }
    }catch(err)
    {
      console.log("db error:",err);
      return {
        success:false,
        message:"Something went wrong !",
      }
    }
  }

  async findAll()
  {
    try{
      let result=await this.userModel.find();
      return {
        success:true,
        user:result
      }
    }catch(error)
    {
      console.log("display:",error);
      return{
        success:false,
        message:"Something went wrong !"
      }
    }
  }
}
