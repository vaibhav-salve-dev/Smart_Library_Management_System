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
      const exist=await this.bookModel.findOne({title:body.title,author:body.author})
        if(exist)
        {
            return{
                sucess:false,
                message:"Book already exist !"
            }
        }
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

 async findAllBooks(query: any) {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      genre,
      rating,
      isFavourite,
      sortBy = "createdAt",
      order = "desc"
    } = query;

    const filter: any = {};

    // 🔍 SEARCH (title OR author)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } }
      ];
    }

    // 🎭 GENRE FILTER
    if (genre) {
      filter.genre = genre;
    }

    // ⭐ RATING FILTER
    if (rating) {
      filter.rating = Number(rating);
    }

    // ❤️ FAVORITE FILTER
    if (isFavourite !== undefined) {
      filter.isFavourite = isFavourite === "true";
    }

    // 📄 PAGINATION
    const skip = (Number(page) - 1) * Number(limit);

    // ↕️ SORTING
    const sortOrder = order === "asc" ? 1 : -1;

    const sort: any = {
      [sortBy]: sortOrder
    };

    // 🔥 QUERY EXECUTION
    const books = await this.bookModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    // 📊 TOTAL COUNT (for pagination metadata)
    const total = await this.bookModel.countDocuments(filter);

    return {
      success: true,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
      totalRecords: total,
      books
    };

  } catch (error) {
    return {
      success: false,
      message: "Something went wrong"
    };
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