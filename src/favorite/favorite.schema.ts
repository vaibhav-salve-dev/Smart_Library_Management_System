import {
  Schema,
  Prop,
  SchemaFactory,
} from "@nestjs/mongoose";

import { Document } from "mongoose";

@Schema({
  timestamps: true,
})

export class Favorite extends Document {

  @Prop({
    required: true,
  })
  userEmail: string;

  @Prop({
    required: true,
  })
  bookId: string;
}

export const FavoriteSchema =
  SchemaFactory.createForClass(Favorite);