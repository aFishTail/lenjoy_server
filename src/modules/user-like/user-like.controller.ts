import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserLikeService } from './user-like.service';
import { CreateUserLikeDto } from './dto/create-user-like.dto';
import { UpdateUserLikeDto } from './dto/update-user-like.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('用户点赞')
@Controller('user-like')
export class UserLikeController {
  constructor(private readonly userLikeService: UserLikeService) {}

  @Post()
  create(@Body() createUserLikeDto: CreateUserLikeDto) {
    return this.userLikeService.create(createUserLikeDto);
  }

  @Get()
  findAll() {
    return this.userLikeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userLikeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserLikeDto: UpdateUserLikeDto) {
    return this.userLikeService.update(+id, updateUserLikeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userLikeService.remove(+id);
  }
}
