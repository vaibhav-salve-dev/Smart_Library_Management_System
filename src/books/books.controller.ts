import { Controller, Get, Post, Patch, Body } from '@nestjs/common';
import { BooksService } from './books.service';
@Controller('books')
export class BooksController {
    constructor(private readonly books:BooksService){}
    @Post("/add")
    async addBook(@Body() body){
        let result=await this.books.add(body);
        return result;
    }
    
}
