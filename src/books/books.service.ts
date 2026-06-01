import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './book.schema';
import { Borrow } from '../borrow/borrow.schema';
import { Model } from 'mongoose';
import { Inject } from '@nestjs/common';
import { SortOrder, Types } from 'mongoose';
import { Favorite } from "../favorite/favorite.schema";
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class BooksService {
  constructor(
    @Inject("CLOUDINARY") private cloudinary: any,
    @InjectModel(Book.name)
    private bookModel: Model<Book>,
    @InjectModel(Borrow.name)
    private borrowModel: Model<Borrow>,
    @InjectModel(Favorite.name)
    private favoriteModel: Model<Favorite>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) { }

  private async invalidateBooksCache() {

  const version =
    await this.cacheManager.get(
      "books-version"
    ) || 1;

  await this.cacheManager.set(
    "books-version",
    Number(version) + 1,
  );
}

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

      await this.invalidateBooksCache();

      return {

        success: true,
        message: "Book added successfully",
        book: result

      };

    } catch (error: any) {

      // console.log("image error: ", error)
      if (error.name === "ValidationError") {

        const validationErrors = {};

        for (const field in error.errors) {
          validationErrors[field] =
            error.errors[field].message;
        }

        return {
          success: false,
          message: "Validation failed",
          errors: validationErrors,
        };
      }
    }
  }

  async findAllBooks(
    query: any,
    user,
  ) {
    try {
     const version =
  await this.cacheManager.get(
    "books-version"
  ) || 1;

const cacheKey =
  `books:v${version}:${user.email}:${JSON.stringify(query)}`;
      const cachedData =
        await this.cacheManager.get(cacheKey);

      if (cachedData) {

        console.log("CACHE HIT");

        return cachedData;
      }
      const {
        page = 1,
        limit = 10,
        search = "",
        genre = "",
        sortBy = "createdAt",
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


      const allowedSortFields = [
        "createdAt",
        "title",
        "author",
      ];

      const sortField =
        allowedSortFields.includes(sortBy)
          ? sortBy
          : "createdAt";

      const sort: Record<string, SortOrder> = {
        [sortField]:
          sortOrder === "desc" ? -1 : 1,
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
      const favorites =
        await this.favoriteModel.find({
          userEmail: user.email,
        });
      const favoriteBookIds =
        favorites.map(
          (fav) => fav.bookId
        );
      const updatedBooks =
        books.map((book: any) => ({
          ...book,

          isFavorite:
            favoriteBookIds.includes(
              book._id.toString()
            ),
        }));
      const totalBooks =
        await this.bookModel.countDocuments(filter);

      const totalPages = Math.ceil(
        totalBooks / Number(limit)
      );

      const response = {
        success: true,
        books: updatedBooks,
        page: Number(page),
        totalPages,
        hasMore: Number(page) < totalPages,
      };

      await this.cacheManager.set(
        cacheKey,
        response,
        60000
      );

      return response;

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
      const cacheKey = `book:${id}`;

      const cached =
        await this.cacheManager.get(cacheKey);

      if (cached) {

        console.log("BOOK CACHE HIT");

        return cached;
      }
      const result = await this.bookModel.findById(id);

      if (!result) {
        throw new NotFoundException(
          "Book not found"
        );
      }

      const response = {
        success: true,
        book: result
      };

      await this.cacheManager.set(
        cacheKey,
        response,
        60000
      );

      return response;

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
          {
            new: true,
            runValidators: true,
          }
        );
await this.invalidateBooksCache();
      return {
        success: true,
        book: result,
      };

    } catch (error: any) {

      if (error.name === "ValidationError") {

        const validationErrors = {};

        for (const field in error.errors) {
          validationErrors[field] =
            error.errors[field].message;
        }

        return {
          success: false,
          message: "Validation failed",
          errors: validationErrors,
        };
      }

    }
  }

  async deleteBook(id: string) {
    try {

      const result2 = await this.borrowModel.deleteMany({
        bookId: new Types.ObjectId(id),
      });

      const result =
        await this.bookModel.findByIdAndDelete(id);

      await this.invalidateBooksCache();
      
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

  async toggleFavorite(
    bookId: string,
    user,
  ) {

    const exist =
      await this.favoriteModel.findOne({
        bookId,
        userEmail: user.email,
      });

    if (exist) {

      await this.favoriteModel.findByIdAndDelete(
        exist._id
      );

      await this.cacheManager.del(
        `analytics:${user.email}`
      );

      return {
        success: true,
        isFavorite: false,
      };
    }

    await this.favoriteModel.create({
      bookId,
      userEmail: user.email,
    });

    await this.cacheManager.del(
      `analytics:${user.email}`
    );

    return {
      success: true,
      isFavorite: true,
    };
  }

}