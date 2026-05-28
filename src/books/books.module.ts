import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Book,BookSchema } from './book.schema';
import { CloudinaryProvider } from '../config/cloudinary.provider';
import { Borrow,BorrowSchema } from '../borrow/borrow.schema';
@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name:Book.name,
        schema:BookSchema
      },
      {
        name:Borrow.name,
        schema:BorrowSchema
      }
    ])
  ],
  controllers: [BooksController],
  providers: [BooksService,CloudinaryProvider]
})
export class BooksModule {}
