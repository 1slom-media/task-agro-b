import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { CreateCategoryDto } from './dtos/dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private repo: Repository<CategoryEntity>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['subcategories', 'events'] });
  }

  create(dto: CreateCategoryDto) {
    const category = this.repo.create(dto);
    return this.repo.save(category);
  }

  async update(id: number, attrs: Partial<CategoryEntity>) {
    const category = await this.repo.findOneBy({ id });

    if (!category) {
      throw new NotFoundException('category not found');
    }

    Object.assign(category, attrs);
    return this.repo.save(category);
  }

  async delete(id: number) {
    const category = await this.repo.findOneBy({ id });

    if (!category) {
      throw new NotFoundException('category not found');
    }

    return this.repo.remove(category);
  }
}
