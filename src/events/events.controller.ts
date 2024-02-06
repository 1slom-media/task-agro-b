import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { EventDto } from './dtos/dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync, unlinkSync } from 'fs';
let imagePath;

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (req, file, cb) => {
          const fileName = file.originalname;
          imagePath = `${uuidv4()}_${fileName}`;
          cb(null, imagePath);
        },
      }),
    }),
  )
  @Post()
  createEvents(
    @Body() body: EventDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @UploadedFile() file: Express.Multer.File,
  ) {
    body.image = `http://localhost:3000/images/${imagePath}`;
    return this.eventsService.create(body);
  }

  @Patch('/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (req, file, cb) => {
          const fileName = file.originalname;
          imagePath = `${uuidv4()}_${fileName}`;
          cb(null, imagePath);
        },
      }),
    }),
  )
  async updateEvents(
    @Param('id') id: string,
    @Body() body: EventDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const existingEvent = await this.eventsService.findById(parseInt(id));
      if (existingEvent && existingEvent.image) {
        const oldImagePath = existingEvent.image.replace(
          'http://localhost:3000/images/',
          '',
        );
        const oldImageFullPath = join(process.cwd(), 'uploads', oldImagePath);
        if (existsSync(oldImageFullPath)) {
          unlinkSync(oldImageFullPath);
        }
      }
      body.image = `http://localhost:3000/images/${imagePath}`;
    }
    return this.eventsService.update(parseInt(id), body);
  }

  @Delete('/:id')
  dleteEvents(@Param('id') id: string) {
    return this.eventsService.delete(parseInt(id));
  }
}
