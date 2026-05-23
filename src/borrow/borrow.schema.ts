import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    timestamps:true
})
export class Borrow{
    @Prop()
    userId!:string;
    
    @Prop()
    bookId!:string;
    
    @Prop()
    borrowedAt!:Date;
    
    @Prop()
    returnedAt!:Date;
    

}
export const BorrowSchema = SchemaFactory.createForClass(Borrow);