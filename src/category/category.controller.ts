import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos/dto';
import { CategoryService } from './category.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  createCategory(@Body() body: CreateCategoryDto) {
    return this.categoryService.create(body);
  }

  @Patch('/:id')
  updateCategory(@Param('id') id: string, @Body() body: UpdateCategoryDto) {
    return this.categoryService.update(parseInt(id), body);
  }

  @Delete('/:id')
  dleteCategory(@Param('id') id: string) {
    return this.categoryService.delete(parseInt(id));
  }
}
