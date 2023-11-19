import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, type UserDocument } from './schemas/user.schema';
import { type FilterQuery, Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  create(document: Partial<User>): Promise<UserDocument> {
    return this.userModel.create(document);
  }

  find(filter: FilterQuery<UserDocument>): Promise<UserDocument[]> {
    return this.userModel.find(filter);
  }

  findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }
}
