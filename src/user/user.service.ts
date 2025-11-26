import { Injectable, NotFoundException } from '@nestjs/common';

import { randomUUID } from 'crypto';
import { Users } from 'src/types/types';

@Injectable()
export class UserService {
  private users: Users = [
    {
      id: randomUUID(),
      login: 'user',
      password: '1',
      version: 1,
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
}
