import { Body, Controller, Session, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User, type UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { SigninUserDto } from './dtos/signin-user.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() body: CreateUserDto,
    @Session() session: any
  ): Promise<UserDocument> {
    const user = await this.authService.signup(body);

    session.userId = user._id;

    return user;
  }

  @Get('whoami')
  whoami(@CurrentUser() user: User): User {
    return user;
  }

  @Post('signout')
  signout(@Session() session: any): void {
    session.userId = null;
  }

  @Post('signin')
  async signin(
    @Body() body: SigninUserDto,
    @Session() session
  ): Promise<UserDocument> {
    const user = await this.authService.signin(body);

    session.userId = user._id;

    return user;
  }
}
