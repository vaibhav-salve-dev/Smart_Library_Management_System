import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    timestamps: true
})
export class Book {
    @Prop({
  required: true,
  trim: true,
  minlength: 3
})
title!: string;

    @Prop()
    author!: string;

    @Prop()
    genre!: string;

    @Prop()
    description!: string;

    @Prop({
  required: true,
  validate: {
    validator: function (value: number) {
      return value <= new Date().getFullYear();
    },
    message: 'Published year cannot be in the future'
  }
})
publishYear!: number;

    @Prop({
        min: 1,
        max: 5
    })
    rating!: number;

    @Prop({
        default: false
    })
    isFavourite!: boolean;

    @Prop({
        enum: ["available", "borrowed"],
        default: "available"
    })
    status!: string;

    @Prop()
    coverImage!: string;

    @Prop()
    createdBy!: string;

}

export const BookSchema = SchemaFactory.createForClass(Book);
