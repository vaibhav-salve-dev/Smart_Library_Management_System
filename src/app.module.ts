import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module';

@Module({
  imports: [ConfigModule.forRoot({
   isGlobal:true
}),AuthModule,MongooseModule.forRoot('mongodb://localhost:27017/library'), UsersModule,BooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}

