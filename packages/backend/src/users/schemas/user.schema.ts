import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { type ObjectId } from 'mongoose';

export type UserDocument = User & Document & { _id: ObjectId };

@Schema()
export class User {
  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
