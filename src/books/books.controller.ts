import { Controller, Get, Post, Patch, Body, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BooksService } from './books.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(
    private readonly books: BooksService
  ) { }

  @ApiOperation({
          summary: 'Add book in the DB'
      })
      
      @ApiOkResponse({
  description: 'Book added successfully',
})

@ApiBadRequestResponse({
  description: 'Validation failed',
})

@ApiUnauthorizedResponse({
  description: 'User not authenticated',
})
  @ApiBearerAuth()
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

  @ApiOperation({
          summary: 'read all books from DB'
      })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAllBooks(@Request() req) {
   return this.books.findAllBooks(
  req.query,
  req.user,
);
  }

  @ApiOperation({
          summary: 'Get specific book'
      })
      @ApiOkResponse({
  description: 'Book fetched successfully',
})

@ApiNotFoundResponse({
  description: 'Book not found',
})

@ApiUnauthorizedResponse({
  description: 'User not authenticated',
})
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(":id")
  getBook(@Param("id") id: string) {
    return this.books.getBook(id);
  }


  @ApiOperation({
          summary: 'update the existing book data'
      })
      @ApiOkResponse({
  description: 'Book updated successfully',
})

@ApiNotFoundResponse({
  description: 'Book not found',
})

@ApiUnauthorizedResponse({
  description: 'User not authenticated',
})
      
  @ApiBearerAuth()
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

  @ApiOperation({
          summary: 'Delete book from DB'
      })
      @ApiOkResponse({
  description: 'Book deleted successfully',
})

@ApiNotFoundResponse({
  description: 'Book not found',
})

@ApiUnauthorizedResponse({
  description: 'User not authenticated',
})
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(":id")
  deleteBook(
    @Param("id") id: string
  ) {
    return this.books.deleteBook(id);
  }

  @ApiOperation({
          summary: 'Add or remive book from favourite'
      })
      @ApiOkResponse({
  description: 'Favourite status changed',
})

@ApiUnauthorizedResponse({
  description: 'User not authenticated',
})
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Post(":id/favorite")
  toggleFavorite(
    @Param("id") id: string,
    @Request() req,
  ) {
    return this.books.toggleFavorite(
      id,
      req.user,
    );
  }
}