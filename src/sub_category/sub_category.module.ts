import { Module } from '@nestjs/common';
import { SubCategoryService } from './sub_category.service';
import { SubCategoryResolver } from './sub_category.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubcategoryEntity } from './sub_category.entity';
import { SubCategoryController } from './sub_category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SubcategoryEntity])],
  providers: [SubCategoryService, SubCategoryResolver],
  controllers: [SubCategoryController],
})
export class SubCategoryModule {}
