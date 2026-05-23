import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './book.schema';
import { Model } from 'mongoose';

@Injectable()
export class BooksService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: Model<Book>
    ) { }
    async add(body) {
        try {
            let result = await this.bookModel.create(body);
            return {
                success: true,
                message: "Book Added successfully",
                book: result
            }
        } catch (err) {
            console.log("db error:", err);
            return {
                success: false,
                message: "Something went wrong !",
            }
        }
    }

    async findAllBooks() {
        try {
            let result = await this.bookModel.find();
            return {
                success: true,
                book: result
            }
        } catch (error) {
            console.log("display:", error);
            return {
                success: false,
                message: "Something went wrong !"
            }
        }
    }
}
