import { Mutation, Resolver, Args, Query } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './types';

@Resolver()
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [Category])
  async getAllCategory() {
    return this.categoryService.findAll();
  }
}
