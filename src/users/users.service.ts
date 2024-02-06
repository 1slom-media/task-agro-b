import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UsersEntity } from './user.entity';
import * as fs from 'fs/promises';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity) private repo: Repository<UsersEntity>,
  ) {}

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id });
  }

  findAll() {
    return this.repo.find();
  }

  findEmail(email: string) {
    if (!email) {
      return null;
    }
    return this.repo.findOneBy({ email });
  }

  createUsers(
    fullname: string,
    email: string,
    password: string,
    role: string | null,
  ) {
    const user = this.repo.create({ fullname, email, password, role });
    return this.repo.save(user);
  }

  async updateProfile(
    userId: number,
    { avatarUrl, ...attrs }: Partial<UsersEntity>,
  ) {
    const user = await this.repo.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const oldAvatarUrl = user.avatarUrl;

    Object.assign(user, attrs);

    if (avatarUrl) {
      user.avatarUrl = avatarUrl;
    }

    const updatedUser = await this.repo.save(user);

    if (oldAvatarUrl && avatarUrl) {
      const imageName = oldAvatarUrl.split('/').pop();
      const imagePath = `uploads/${imageName}`;

      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.log(error);
      }
    }

    return updatedUser;
  }

  async searchUsers(fullname: string) {
    const users = await this.repo.find({
      where: {
        fullname: Like(`%${fullname}%`),
      },
    });

    return users;
  }
}
