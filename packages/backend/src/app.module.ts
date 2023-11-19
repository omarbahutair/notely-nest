import {
  Module,
  ValidationPipe,
  type MiddlewareConsumer,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_PIPE } from '@nestjs/core';
import cookieSession = require('cookie-session');
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        exceptionFactory: (errors) => {
          return new UnprocessableEntityException({
            statusCode: 422,
            error: 'Unprocessable Entity',
            message: errors.reduce(
              (acc, e) => ({
                ...acc,
                [e.property]: Object.values(e.constraints),
              }),
              {}
            ),
          });
        },
      }),
    },
  ],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        cookieSession({ keys: [this.configService.get<string>('COOKIE_KEY')] })
      )
      .forRoutes('*');
  }
}
