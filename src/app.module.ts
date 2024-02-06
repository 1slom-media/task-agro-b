import {
  BadRequestException,
  MiddlewareConsumer,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersEntity } from './users/user.entity';
import { join } from 'path';
import { TokenService } from './token/token.service';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub_category/sub_category.module';
import { CategoryEntity } from './category/category.entity';
import { SubcategoryEntity } from './sub_category/sub_category.entity';
import { EventsModule } from './events/events.module';
import { EventEntity } from './events/events.entity';
import cookieSession from 'cookie-session';

const pubSub = new RedisPubSub({
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: 'islom_01',
    retryStrategy: (times) => {
      return Math.min(times * 50, 2000);
    },
  },
});

@Module({
  // env config
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    // uploads static
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/images',
    }),
    // graphQl
    GraphQLModule.forRootAsync({
      imports: [ConfigModule, AppModule],
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: async (
        configService: ConfigService,
        tokenService: TokenService,
      ) => {
        return {
          installSubscriptionHandlers: true,
          playground: true,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          subscriptions: {
            'graphql-ws': true,
            'subscriptions-transport-ws': true,
          },
          onConnect: (connectionParams) => {
            const token = tokenService.extractToken(connectionParams);

            if (!token) {
              throw new Error('Token not provided');
            }
            const user = tokenService.validateToken(token);
            if (!user) {
              throw new Error('Invalid token');
            }
            return { user };
          },
          context: ({ req, res, connection }) => {
            if (connection) {
              return { req, res, user: connection.context.user, pubSub }; // Injecting pubSub into context
            }
            return { req, res };
          },
        };
      },
    }),
    // database connection
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          port: config.get<number>('PG_PORT'),
          username: config.get<string>('PG_USER'),
          host: config.get<string>('PG_HOST'),
          database: config.get<string>('PG_DATABASE'),
          password: config.get<string>('PG_PASSWORD'),
          entities: [
            UsersEntity,
            CategoryEntity,
            SubcategoryEntity,
            EventEntity,
          ],
          synchronize: true,
        };
      },
    }),
    AuthModule,
    UsersModule,
    CategoryModule,
    SubCategoryModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        exceptionFactory: (errors) => {
          const formattedErrors = errors.reduce((accumulator, error) => {
            accumulator[error.property] = Object.values(error.constraints).join(
              ', ',
            );
            return accumulator;
          }, {});

          throw new BadRequestException(formattedErrors);
        },
      }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*');
  }
}
