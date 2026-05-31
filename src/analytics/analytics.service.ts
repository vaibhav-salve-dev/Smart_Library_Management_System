import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Book } from "../books/book.schema";
import { Borrow } from "../borrow/borrow.schema";
import { Favorite } from "../favorite/favorite.schema";
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';

@Injectable()

export class AnalyticsService {

  constructor(

    @InjectModel(Book.name)
    private bookModel: Model<Book>,

    @InjectModel(Borrow.name)
    private borrowModel: Model<Borrow>,

    @InjectModel(Favorite.name)
    private favoriteModel: Model<Favorite>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) { }

  async getDashboard(user) {

    const cacheKey =
      `analytics:${user.email}`;

    const cached =
      await this.cacheManager.get(cacheKey);

    if (cached) {

      console.log(
        "ANALYTICS CACHE HIT"
      );

      return cached;
    }
    // TOTAL BOOKS

    const totalBooks =
      await this.bookModel.countDocuments();

    // BOOKS CREATED BY USER

    const myBooks =
      await this.bookModel.countDocuments({
        createdBy: user.email,
      });

    // FAVORITES

    const favoriteBooks =
      await this.favoriteModel.countDocuments({
        userEmail: user.email,
      });

    // CURRENTLY BORROWED

    const currentBorrowed =
      await this.borrowModel.countDocuments({
        userEmail: user.email,
        status: 'borrowed',
      });

    // TOTAL BORROWED

    const totalBorrowed =
      await this.borrowModel.countDocuments({
        userEmail: user.email,
      });

    // RECENT BOOKS

    const recentBooks =
      await this.bookModel
        .find({
          createdBy: user.email,
        })
        .sort({ createdAt: -1 })
        .limit(6);

    // FAVORITE BOOKS DETAILS

    const favorites =
      await this.favoriteModel.find({
        userEmail: user.email,
      });

    const favoriteBookIds =
      favorites.map(
        (fav: any) => fav.bookId
      );

    const favoriteBooksList =
      await this.bookModel.find({
        _id: {
          $in: favoriteBookIds,
        },
      });

    const response = {

      success: true,

      stats: {
        totalBooks,
        myBooks,
        favoriteBooks,
        currentBorrowed,
        totalBorrowed,
      },

      recentBooks,

      favoriteBooksList,
    };

    await this.cacheManager.set(
      cacheKey,
      response,
      60000
    );

    return response;
  }
}