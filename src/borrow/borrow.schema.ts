import {
  Schema,
  Prop,
  SchemaFactory
} from '@nestjs/mongoose';

import mongoose from 'mongoose';
import { Book } from '../books/book.schema';

@Schema({
  timestamps:true
})

export class Borrow {

  @Prop({
    required:true
  })
  userEmail!:string;

  @Prop({
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Book',
  required: true
})
bookId!: mongoose.Types.ObjectId;

  @Prop({
    enum:["borrowed","returned"],
    default:"borrowed"
  })
  status!:string;

  @Prop({
    default:null
  })
  returnedAt!:Date;

  
}

export const BorrowSchema =
  SchemaFactory.createForClass(Borrow);