import {Controller,Get,Post,Patch,Body,Param,Delete,UseGuards,Request,UseInterceptors,UploadedFile} from '@nestjs/common';
import { BooksService } from './books.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('books')
export class BooksController {
    constructor(
        private readonly books: BooksService
    ) { }

   @UseGuards(AuthGuard('jwt'))

@Post("/add")

@UseInterceptors(
  FileInterceptor(
  "coverImage",
  {
    dest: "./uploads"
  }
)
)

async addBook(
  @UploadedFile() file,
  @Body() body,
  @Request() req
) {
  return this.books.add(
    body,
    file,
    req.user
  );
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

@UseInterceptors(
  FileInterceptor("coverImage", {
    dest: "./uploads",
  }),
)

updateBook(
  @Param("id") id: string,
  @UploadedFile() file,
  @Body() body,
  @Request() req,
) {
  return this.books.updateBook(
    id,
    body,
    file,
    req.user,
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