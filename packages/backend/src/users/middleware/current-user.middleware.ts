import { Injectable, type NestMiddleware } from '@nestjs/common';
import { type Request, type Response, type NextFunction } from 'express';
import { UsersService } from '../users.service';
import { type User } from '../schemas/user.schema';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.usersService.findById(userId);

      req.currentUser = user;
    }

    next();
  }
}
