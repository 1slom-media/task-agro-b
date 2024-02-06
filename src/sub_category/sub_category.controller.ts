import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { SubCategoryService } from './sub_category.service';
import { SubCategoryDto } from './dtos/dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('sub_category')
@Controller('sub_category')
export class SubCategoryController {
  constructor(private subCategoryService: SubCategoryService) {}

  @Post()
  createSebCategory(@Body() body: SubCategoryDto) {
    return this.subCategoryService.create(body);
  }

  @Patch('/:id')
  updateSubCategory(@Param('id') id: string, @Body() body: SubCategoryDto) {
    return this.subCategoryService.update(parseInt(id), body);
  }

  @Delete('/:id')
  dleteCategory(@Param('id') id: string) {
    return this.subCategoryService.delete(parseInt(id));
  }
}
