import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { type CreateUserDto } from './dtos/create-user.dto';
import { type UserDocument } from './schemas/user.schema';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(document: CreateUserDto): Promise<UserDocument> {
    const users = await this.usersService.find({ email: document.email });

    if (users.length) throw new BadRequestException('email is taken');

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(document.password, salt, 32)) as Buffer;

    document.password = `${salt}.${hash.toString('hex')}`;

    const user = await this.usersService.create(document);

    return user;
  }
}
