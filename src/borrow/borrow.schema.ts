import {
  Schema,
  Prop,
  SchemaFactory
} from '@nestjs/mongoose';

@Schema({
  timestamps:true
})

export class Borrow {

  @Prop({
    required:true
  })
  userEmail!:string;

  @Prop({
    required:true
  })
  bookId!:string;

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