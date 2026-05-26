import { Controller, Get, Post, Patch, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { BooksService } from './books.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('books')
export class BooksController {
    constructor(
        private readonly books: BooksService
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Post("/add")
    async addBook(
        @Body() body,
        @Request() req
    ) {
        return this.books.add(body, req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    getAllBooks(@Request() req) {
        return this.books.findAllBooks(req.query);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(":id")
    getBook(@Param("id") id: string) {
        return this.books.getBook(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(":id")
    updateBook(
        @Param("id") id: string,
        @Body() body,
        @Request() req
    ) {
        return this.books.updateBook(
            id,
            body,
            req.user
        );
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Delete(":id")
    deleteBook(
        @Param("id") id: string
    ) {
        return this.books.deleteBook(id);
    }

}