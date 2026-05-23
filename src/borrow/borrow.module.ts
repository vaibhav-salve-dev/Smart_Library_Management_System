import { Module } from '@nestjs/common';

import { BorrowController } from './borrow.controller';

import { BorrowService } from './borrow.service';

import { MongooseModule } from '@nestjs/mongoose';

import {
  Borrow,
  BorrowSchema
} from './borrow.schema';

import {
  Book,
  BookSchema
} from '../books/book.schema';

@Module({

  imports:[

    MongooseModule.forFeature([

      {
        name:Borrow.name,
        schema:BorrowSchema
      },

      {
        name:Book.name,
        schema:BookSchema
      }

    ])

  ],

  controllers:[BorrowController],

  providers:[BorrowService]

})

export class BorrowModule {}