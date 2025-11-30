import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { TypeUser, Users } from 'src/types/types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ResponseUserDto } from './dto/response-user.dto';

@Injectable()
export class UserService {
  private users: Users = [];

  private returnRes(user: TypeUser): ResponseUserDto {
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  findAll() {
    return Array.from(this.users, (el) => this.returnRes(el));
  }

  findById(id: string, all?: boolean) {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException('Not Found');
    }

    return all ? user : this.returnRes(user);
  }

  create(dto: CreateUserDto) {
    const user = new User(dto.login, dto.password);

    this.users.push(user);

    return this.returnRes(user);
  }

  update(dto: UpdatePasswordDto, id: string) {
    const date = Date.now();
    const user = <TypeUser>this.findById(id, true);

    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException('old password is not correct');
    }

    (user.password = dto.newPassword), (user.updatedAt = date), user.version++;

    return this.returnRes(user);
  }

  delete(id: string) {
    const userForDel = this.findById(id);

    this.users = this.users.filter((user) => user.id !== userForDel.id);
  }
}
