import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import { BorrowModule } from './borrow/borrow.module';
import { CloudinaryProvider } from './config/cloudinary.provider';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), AuthModule, MongooseModule.forRoot('mongodb://localhost:27017/library'), UsersModule, BooksModule, BorrowModule],
  controllers: [AppController],
  providers: [AppService, CloudinaryProvider],
  exports: [CloudinaryProvider]
})
export class AppModule {
}

