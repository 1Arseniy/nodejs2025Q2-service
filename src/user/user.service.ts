import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { randomUUID } from 'crypto';
import { User, Users } from 'src/types/types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private users: Users = [
    {
      id: randomUUID(),
      login: 'user',
      password: '1',
      version: 0,
      createdAt: 2,
      updatedAt: 0,
    },
  ];

  findAll() {
    return this.users;
  }

  findById(id: string) {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException('Not Found');
    }

    return user;
  }

  create(dto: CreateUserDto) {
    const date = Date.now();

    const user: User = {
      id: randomUUID(),
      login: dto.login,
      password: dto.password,
      version: 0,
      createdAt: date,
      updatedAt: date,
    };

    this.users.push(user);

    return user;
  }

  update(dto: UpdatePasswordDto, id: string) {
    const date = Date.now();
    const user = this.findById(id);

    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException('old password is not correct');
    }

    (user.password = dto.newPassword), (user.updatedAt = date), user.version++;
    return user;
  }

  delete(id: string) {
    const userForDel = this.findById(id);

    this.users = this.users.filter((user) => user.id !== userForDel.id);
  }
}
