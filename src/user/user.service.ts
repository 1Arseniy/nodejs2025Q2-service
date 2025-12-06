import {
  ForbiddenException,
  // ForbiddenException,
  Injectable,
  NotFoundException,
  // NotFoundException,
} from '@nestjs/common';

import { TypeUser } from 'src/types/types';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdatePasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ResponseUserDto } from './dto/response-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private returnRes(user: TypeUser): ResponseUserDto {
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: {
        createdAt: true,
        id: true,
        login: true,
        updatedAt: true,
        version: true,
      },
    });
  }

  async findById(id: string, all?: boolean) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Not Found');
    }

    return all ? user : this.returnRes(user);
  }

  async create(dto: CreateUserDto) {
    const date = Date.now();
    const userObj: TypeUser = {
      id: randomUUID(),
      login: dto.login,
      password: dto.password,
      createdAt: date,
      updatedAt: date,
      version: 1,
    };

    const user = this.usersRepository.create(userObj);
    await this.usersRepository.save(user);
    // const user = new User(dto.login, dto.password);

    // this.users.push(user);

    return this.returnRes(user);
  }

  async update(dto: UpdatePasswordDto, id: string) {
    const date = Date.now();
    const user = await (<Promise<User>>this.findById(id, true));

    // await this.usersRepository.update(id, dto);
    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException('old password is not correct');
    }

    (user.password = dto.newPassword), (user.updatedAt = date), user.version++;

    await this.usersRepository.save(user);

    return this.returnRes(user);
  }

  async delete(id: string) {
    const res = await this.usersRepository.delete(id);

    if (res.affected === 0) {
      throw new NotFoundException(`User not found`);
    }
  }
}
