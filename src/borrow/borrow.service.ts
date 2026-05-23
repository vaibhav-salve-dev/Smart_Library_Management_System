import {Injectable,ForbiddenException,NotFoundException
} from '@nestjs/common';

import { InjectModel }
from '@nestjs/mongoose';

import { Model }
from 'mongoose';

import {
  Borrow
} from './borrow.schema';

import {
  Book
} from '../books/book.schema';

@Injectable()

export class BorrowService {

constructor(

   @InjectModel(Borrow.name)

   private borrowModel:Model<Borrow>,

   @InjectModel(Book.name)

   private bookModel:Model<Book>

){}

  // BORROW BOOK

  async borrowBook(
    bookId:string,
    user
  )
  {
    const book =
      await this.bookModel.findById(bookId);

    if(!book)
    {
      throw new NotFoundException(
        "Book not found"
      );
    }

    if(book.status === "borrowed")
    {
      throw new ForbiddenException(
        "Book already borrowed"
      );
    }

    const count =
      await this.borrowModel.countDocuments({

        userEmail:user.email,
        status:"borrowed"

      });

    if(count >= 3)
    {
      throw new ForbiddenException(
        "Borrow limit exceeded"
      );
    }

    await this.borrowModel.create({

      userEmail:user.email,
      bookId:bookId

    });

    book.status = "borrowed";

    await book.save();

    return {

      success:true,
      message:"Book borrowed successfully"

    };
  }

  // RETURN BOOK

  async returnBook(
    bookId:string,
    user
  )
  {
    const borrow =
      await this.borrowModel.findOne({

        bookId:bookId,
        userEmail:user.email,
        status:"borrowed"

      });

    if(!borrow)
    {
      throw new ForbiddenException(
        "No borrowed book found"
      );
    }

    borrow.status = "returned";

    borrow.returnedAt = new Date();

    await borrow.save();

    const book =
      await this.bookModel.findById(bookId);

    if(book)
    {
      book.status = "available";

      await book.save();
    }

    return {

      success:true,
      message:"Book returned successfully"

    };
  }

  // HISTORY

  async history(user)
  {
    const result =
      await this.borrowModel.find({

        userEmail:user.email

      });

    return {

      success:true,
      history:result

    };
  }
}