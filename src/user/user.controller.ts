import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/types/types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): User {
    return this.userService.findById(id);
  }
}
