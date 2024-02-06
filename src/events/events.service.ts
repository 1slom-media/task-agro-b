import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './events.entity';
import { Repository } from 'typeorm';
import { EventDto } from './dtos/dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity) private repo: Repository<EventEntity>,
  ) {}

  create(dto: EventDto) {
    const event = this.repo.create(dto);
    return this.repo.save(event);
  }

  findAll() {
    return this.repo.find({
      relations: {
        category: true,
        subcategories: true,
        user: true,
      },
    });
  }

  async findById(id: number) {
    if (!id) {
      throw new NotFoundException('events not found');
    }
    return this.repo.findOneBy({ id });
  }

  async update(id: number, attrs: Partial<EventEntity>) {
    const events = await this.repo.findOneBy({ id });

    if (!events) {
      throw new NotFoundException('events not found');
    }

    Object.assign(events, attrs);
    return this.repo.save(events);
  }

  async delete(id: number) {
    const events = await this.repo.findOneBy({ id });

    if (!events) {
      throw new NotFoundException('events not found');
    }

    return this.repo.remove(events);
  }

  async filterEvents(
    subcategoryId: number,
    day: string,
    eventType: string,
    fullname: string,
  ) {
    const queryBuilder = this.repo.createQueryBuilder('events');
    queryBuilder.leftJoinAndSelect('events.category', 'category');
    queryBuilder.leftJoinAndSelect('events.subcategories', 'subcategories');
    queryBuilder.leftJoinAndSelect('events.user', 'user');

    if (subcategoryId) {
      queryBuilder.andWhere('subcategories.id = :subcategoryId', {
        subcategoryId,
      });
    }

    if (day) {
      queryBuilder.andWhere('events.day = :day', { day });
    }

    if (eventType) {
      queryBuilder.andWhere('events.event_type = :eventType', { eventType });
    }

    if (fullname) {
      queryBuilder.andWhere('events.fullname = :fullname', { fullname });
    }

    return queryBuilder.getMany();
  }
}
