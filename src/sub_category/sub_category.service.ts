import { Injectable, NotFoundException } from '@nestjs/common';
import { SubcategoryEntity } from './sub_category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategoryDto } from './dtos/dto';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubcategoryEntity)
    private repo: Repository<SubcategoryEntity>,
  ) {}

  findAll() {
    return this.repo.find({ relations: { category: true, events: true } });
  }

  findOneById(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['category'] });
  }

  create(data: SubCategoryDto) {
    const subCategory = this.repo.create(data);
    return this.repo.save(subCategory);
  }

  async update(id: number, attrs: Partial<SubcategoryEntity>) {
    const sub_category = await this.repo.findOneBy({ id });

    if (!sub_category) {
      throw new NotFoundException('sub_category not found');
    }

    Object.assign(sub_category, attrs);
    return this.repo.save(sub_category);
  }

  async delete(id: number) {
    const sub_category = await this.repo.findOneBy({ id });

    if (!sub_category) {
      throw new NotFoundException('sub_category not found');
    }

    return this.repo.remove(sub_category);
  }
}
