import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './book.schema';
import { Borrow } from '../borrow/borrow.schema';
import { Model } from 'mongoose';
import { Inject } from '@nestjs/common';
import { SortOrder, Types } from 'mongoose';

@Injectable()
export class BooksService {
  constructor(
    @Inject("CLOUDINARY") private cloudinary: any,
    @InjectModel(Book.name)
    private bookModel: Model<Book>,
    @InjectModel(Borrow.name)
    private borrowModel: Model<Borrow>,
  ) { }

  async add(body, file, user) {
    try {

      body.createdBy = user.email;

      const exist =
        await this.bookModel.findOne({
          title: body.title,
          author: body.author
        }).lean();

      if (exist) {
        return {
          success: false,
          message: "Book already exists!"
        };
      }


      if (file) {

        const uploadedImage = await this.cloudinary.uploader.upload(
          file.path,
          {
            folder: "library-books",
          }
        );

        body.coverImage =
          uploadedImage.secure_url;
      }

      const result =
        await this.bookModel.create(body);

      return {

        success: true,
        message: "Book added successfully",
        book: result

      };

    } catch (error) {

      console.log("image error: ", error)
      return {

        success: false,
        message: "Something went wrong"

      };

    }
  }

  async findAllBooks(query: any) {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        genre = "",
        sortOrder = "desc",
        minRating,
        status,
        minYear,
        maxYear,
      } = query;

      const filter: any = {};

      if (search) {
        filter.$text = { $search: search };
      }


      if (genre) {
        filter.genre = genre;
      }

      if (minRating) {
        filter.rating = {
          $gte: Number(minRating),
        };
      }


      if (status) {
        filter.status = status;
      }


      if (minYear || maxYear) {

        filter.publishYear = {};

        if (minYear) {
          filter.publishYear.$gte =
            Number(minYear);
        }

        if (maxYear) {
          filter.publishYear.$lte =
            Number(maxYear);
        }
      }


      const sort: Record<string, SortOrder> = {
        createdAt:
          (sortOrder === "desc" ? -1 : 1) as SortOrder,
      };


      const skip =
        (Number(page) - 1) * Number(limit);

      // FETCH BOOKS
      const books = await this.bookModel
        .find(filter)
        .select(
          "title author genre rating status coverImage createdAt"
        )
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean();

      const totalBooks =
        await this.bookModel.countDocuments(filter);

      const totalPages = Math.ceil(
        totalBooks / Number(limit)
      );

      return {
        success: true,
        books,
        page: Number(page),
        totalPages,
        hasMore: Number(page) < totalPages,
      };

    } catch (error) {

      console.log(error);

      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }
  async getBook(id: string) {
    try {

      const result = await this.bookModel.findById(id);

      if (!result) {
        throw new NotFoundException(
          "Book not found"
        );
      }

      return {
        success: true,
        book: result
      }

    } catch (error) {

      throw error;

    }
  }

  async updateBook(
    id: string,
    body,
    file,
    user,
  ) {
    try {

      const book =
        await this.bookModel.findById(id);

      if (!book) {
        throw new NotFoundException(
          "Book not found"
        );
      }

   
      if (
        user.role !== "admin" &&
        book.createdBy !== user.email
      ) {
        throw new ForbiddenException(
          "You are not allowed to update this book"
        );
      }

      if (file) {

        const uploadedImage =
          await this.cloudinary.uploader.upload(
            file.path,
            {
              folder: "library-books",
            }
          );

        body.coverImage =
          uploadedImage.secure_url;
      }

      const result =
        await this.bookModel.findByIdAndUpdate(
          id,
          body,
          { new: true }
        );

      return {
        success: true,
        book: result,
      };

    } catch (error) {

      throw error;

    }
  }

  async deleteBook(id: string) {
    try {

      const result2 = await this.borrowModel.deleteMany({
        bookId: new Types.ObjectId(id),
      });

      const result =
        await this.bookModel.findByIdAndDelete(id);

      if (!result) {
        throw new NotFoundException(
          "Book not found"
        );
      }

      return {
        success: true,
        message: "Book deleted successfully"
      }

    } catch (error) {

      throw error;

    }
  }

}