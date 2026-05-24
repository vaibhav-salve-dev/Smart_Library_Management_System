import {Controller,Post,Param,UseGuards,Request,Get} from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('borrow')
export class BorrowController {
  constructor(
    private readonly borrow:BorrowService
  ){}

  @UseGuards(AuthGuard('jwt'))
  @Post(":bookId")
  borrowBook(
    @Param("bookId") bookId:string,
    @Request() req
  )
  {
    return this.borrow.borrowBook(
      bookId,
      req.user
    );
  }

 
  @UseGuards(AuthGuard('jwt'))
  @Post("return/:bookId")
  returnBook(
    @Param("bookId") bookId:string,
    @Request() req
  )
  {
    return this.borrow.returnBook(
      bookId,
      req.user
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get("history/all")
  history(@Request() req)
  {
    return this.borrow.history(
      req.user
    );
  }
}