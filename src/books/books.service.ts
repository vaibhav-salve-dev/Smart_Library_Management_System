import {Injectable,ForbiddenException,NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './book.schema';
import { Model } from 'mongoose';

@Injectable()

export class BooksService {

  constructor(

    @InjectModel(Book.name)

    private bookModel: Model<Book>

  ) {}

  async add(body, user)
  {
    try {

      body.createdBy = user.email;

      const result = await this.bookModel.create(body);

      return {
        success:true,
        message:"Book added successfully",
        book:result
      }

    } catch(error) {

      return {
        success:false,
        message:"Something went wrong"
      }

    }
  }

  async findAllBooks()
  {
    try {

      const result = await this.bookModel.find();

      return {
        success:true,
        books:result
      }

    } catch(error) {

      return {
        success:false,
        message:"Something went wrong"
      }

    }
  }

  async getBook(id:string)
  {
    try {

      const result = await this.bookModel.findById(id);

      if(!result)
      {
        throw new NotFoundException(
          "Book not found"
        );
      }

      return {
        success:true,
        book:result
      }

    } catch(error) {

      throw error;

    }
  }

  async updateBook(
    id:string,
    body,
    user
  )
  {
    try {

      const book =
        await this.bookModel.findById(id);

      if(!book)
      {
        throw new NotFoundException(
          "Book not found"
        );
      }

      // OWNER OR ADMIN

      if(
        user.role !== "admin"
        &&
        book.createdBy !== user.email
      )
      {
        throw new ForbiddenException(
          "You are not allowed to update this book"
        );
      }

      const result =
        await this.bookModel.findByIdAndUpdate(

          id,
          body,
          { new:true }

        );

      return {
        success:true,
        book:result
      }

    } catch(error) {

      throw error;

    }
  }

  async deleteBook(id:string)
  {
    try {

      const result =
        await this.bookModel.findByIdAndDelete(id);

      if(!result)
      {
        throw new NotFoundException(
          "Book not found"
        );
      }

      return {
        success:true,
        message:"Book deleted successfully"
      }

    } catch(error) {

      throw error;

    }
  }
}