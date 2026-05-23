import {Controller,Get,Post,Patch,Body,Param,Delete,UseGuards,Request} from '@nestjs/common';

import { BooksService } from './books.service';

import { AuthGuard } from '@nestjs/passport';

import { RolesGuard } from '../common/guards/roles.guard';

@Controller('books')

export class BooksController {

    constructor(
        private readonly books: BooksService
    ) { }

    // ADMIN + MEMBER

    @UseGuards(AuthGuard('jwt'))

    @Post("/add")

    async addBook(
        @Body() body,
        @Request() req
    ) {
        return this.books.add(body, req.user);
    }

    // LOGGED IN USERS

    @UseGuards(AuthGuard('jwt'))

    @Get()

    getAllBooks() {
        return this.books.findAllBooks();
    }

    // LOGGED IN USERS

    @UseGuards(AuthGuard('jwt'))

    @Get(":id")

    getBook(@Param("id") id: string) {
        return this.books.getBook(id);
    }

    // ONLY OWNER OR ADMIN

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

    // ONLY ADMIN

    @UseGuards(AuthGuard('jwt'), RolesGuard)

    @Delete(":id")

    deleteBook(
        @Param("id") id: string
    ) {
        return this.books.deleteBook(id);
    }
}