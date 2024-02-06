import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from '../guards/graphql-auth.guard';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { User } from './types';
import { Request } from 'express';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createWriteStream } from 'fs';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => User)
  async updateProfile(
    @Args('fullname', { nullable: true }) fullname: string,
    @Args('password', { nullable: true }) password: string,
    @Args('file', { type: () => GraphQLUpload, nullable: true })
    file: GraphQLUpload.FileUpload,
    @Context() context: { req: Request },
  ) {
    const avatarUrl = file ? await this.storeImageAndGetUrl(file) : null;
    const userId = context.req.user.sub;
    const user = {
      fullname,
      avatarUrl,
      password,
    };
    return this.usersService.updateProfile(userId, user);
  }

  private async storeImageAndGetUrl(file: GraphQLUpload) {
    const { createReadStream, filename } = await file;
    const uniqueFilename = `${uuidv4()}_${filename}`;
    const imagePath = join(process.cwd(), 'uploads', uniqueFilename);
    const imageUrl = `http://localhost:3000/images/${uniqueFilename}`;
    const readStream = createReadStream();
    readStream.pipe(createWriteStream(imagePath));
    return imageUrl;
  }

  @Query(() => [User])
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Query(() => [User])
  async searchUsers(@Args('fullname') fullname: string) {
    return this.usersService.searchUsers(fullname);
  }
}
