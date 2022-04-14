import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserSignService } from './user-sign.service';
import { CreateUserSignDto } from './dto/create-user-sign.dto';
import { UpdateUserSignDto } from './dto/update-user-sign.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('签到')
@Controller('user-sign')
export class UserSignController {
  constructor(private readonly userSignService: UserSignService) {}

  @Post()
  create(@Body() createUserSignDto: CreateUserSignDto) {
    return this.userSignService.create(createUserSignDto);
  }

  @Get()
  findAll() {
    return this.userSignService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userSignService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserSignDto: UpdateUserSignDto,
  ) {
    return this.userSignService.update(+id, updateUserSignDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userSignService.remove(+id);
  }
}
