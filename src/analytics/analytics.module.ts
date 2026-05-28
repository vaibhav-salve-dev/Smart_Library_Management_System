import { Module } from "@nestjs/common";

import { MongooseModule } from "@nestjs/mongoose";

import {
  Book,
  BookSchema,
} from "../books/book.schema";

import {
  Borrow,
  BorrowSchema,
} from "../borrow/borrow.schema";

import {
  Favorite,
  FavoriteSchema,
} from "../favorite/favorite.schema";

import { AnalyticsController } from "./analytics.controller";

import { AnalyticsService } from "./analytics.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Book.name,
        schema: BookSchema,
      },

      {
        name: Borrow.name,
        schema: BorrowSchema,
      },

      {
        name: Favorite.name,
        schema: FavoriteSchema,
      },
    ]),
  ],

  controllers: [
    AnalyticsController,
  ],

  providers: [
    AnalyticsService,
  ],
})

export class AnalyticsModule {}