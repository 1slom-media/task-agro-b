import { Query, Resolver } from '@nestjs/graphql';
import { SubCategory } from './types';
import { SubCategoryService } from './sub_category.service';

@Resolver()
export class SubCategoryResolver {
  constructor(private readonly subcategoryService: SubCategoryService) {}

  @Query(() => [SubCategory])
  async getAllSubcategory() {
    return this.subcategoryService.findAll();
  }
}
