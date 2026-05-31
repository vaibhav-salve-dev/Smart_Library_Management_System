import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) { }
  async register(body) {

    try {

      let exist =
        await this.userModel.findOne({
          email: body.email
        });

      if (exist) {

        throw new ConflictException(
          "User already registered"
        );

      }

      let result =
        await this.userModel.create(body);

      return {

        success: true,
        message: "User created successfully",
        user: result
      }

    } catch (err) {

      return{
        success:false,
        message:"Unable to register !",
        error:err
      }

    }

  }

  async findAll() {
    try {
      let result = await this.userModel.find();
      return {
        success: true,
        user: result
      }
    } catch (error) {
      console.log("display:", error);
      return {
        success: false,
        message: "Something went wrong !"
      }
    }
  }
  async findByEmail(email: string) {
    try {

      console.log("email :", email);
      let result = await this.userModel.findOne({ email });
      if (!result) {
        return {
          sucess: false,
          message: "User Not Found !"
        }
      }
      return {
        success: true,
        user: result
      }

    } catch (error) {

      console.log("find user error:", error);

      return {
        success: false,
        message: "Something went wrong!"
      }

    }
  }
}
