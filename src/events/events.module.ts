import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EventsResolver } from './events.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './events.entity';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity]),
    MulterModule.register({
      dest: join(process.cwd(), 'uploads'),
    }),
  ],
  providers: [EventsService, EventsResolver],
  controllers: [EventsController],
})
export class EventsModule {}
