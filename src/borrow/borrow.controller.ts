import { Controller, Post, Param, UseGuards, Request, Get } from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';

@ApiTags('Borrow')
@Controller('borrow')
export class BorrowController {
  constructor(
    private readonly borrow: BorrowService
  ) { }

  @ApiOperation({
            summary: 'borrow book'
        })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(":bookId")
  borrowBook(
    @Param("bookId") bookId: string,
    @Request() req
  ) {
    return this.borrow.borrowBook(
      bookId,
      req.user
    );
  }


  @ApiOperation({
            summary: 'Return borrowed  book'
        })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post("return/:bookId")
  returnBook(
    @Param("bookId") bookId: string,
    @Request() req
  ) {
    return this.borrow.returnBook(
      bookId,
      req.user
    );
  }

  @ApiOperation({
            summary: 'Show history of borrow'
        })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get("history/all")
  history(@Request() req) {
    return this.borrow.history(
      req.user
    );
  }

  @ApiOperation({
            summary: 'get currently borrowed books'
        })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get("active")
  activeBorrows() {
    return this.borrow.activeBorrows();
  }

}