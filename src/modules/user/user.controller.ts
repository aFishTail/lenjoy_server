import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SetEmailDto, UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryUserInputDto, QueryUserOutDto } from './dto/query-user.dto';
import { QueryDetailDto } from 'src/common/base.dto';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('用户管理')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ status: 200, description: '新增用户' })
  @Post('create')
  create(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }

  @Post('list')
  @ApiResponse({ type: User })
  @UseInterceptors(ClassSerializerInterceptor)
  list(@Body() queryParma: QueryUserInputDto) {
    return this.userService.findAll(queryParma);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('update')
  @ApiBody({ type: User })
  update(@Body() param) {
    return this.userService.update(param);
  }

  @Post('detail')
  @ApiBody({ type: QueryDetailDto })
  @ApiResponse({ type: User })
  detail(@Body() param: QueryDetailDto) {
    return this.userService.findById(param.id);
  }

  @Post('updatePassword')
  remove(@Body() param) {
    return this.userService.updatePassword(param.id, param.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('setEmail')
  async setEmail(@Body() payload: SetEmailDto, @Req() req: Request) {
    const { user } = req as any;
    return await this.userService.setEmail(user.id, payload.email);
  }
}
