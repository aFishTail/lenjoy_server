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
import {
  SetEmailDto,
  UpdateUserBasicDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
} from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryUserInputDto, QueryUserOutDto } from './dto/query-user.dto';
import { QueryDetailDto } from 'src/common/base.dto';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QueryUser } from 'src/decorators/user.decorator';
import { VerifyEmailDto } from './dto/user-email.dto';
import { EmialService } from '../email/email.service';

@ApiTags('用户管理')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmialService,
  ) {}

  @ApiOperation({ summary: '用户编辑基础信息' })
  @ApiBody({ type: User })
  @UseGuards(JwtAuthGuard)
  @Post('update/basic')
  updateBasic(@Body() param: UpdateUserBasicDto, @QueryUser('id') id) {
    return this.userService.update({ ...param, id });
  }

  @ApiOperation({ summary: '查看用户详情' })
  @ApiBody({ type: QueryDetailDto })
  @ApiResponse({ type: User })
  @Post('detail')
  detail(@Body() param: QueryDetailDto) {
    return this.userService.findById(param.id);
  }

  @ApiOperation({ summary: '修改密码' })
  @Post('updatePassword')
  remove(@Body() payload: UpdateUserPasswordDto) {
    return this.userService.updatePassword(payload);
  }

  @ApiOperation({ summary: '设置邮箱' })
  @UseGuards(JwtAuthGuard)
  @Post('setEmail')
  async setEmail(@Body() payload: SetEmailDto, @Req() req: Request) {
    const { user } = req as any;
    return await this.userService.setEmail(user.id, payload.email);
  }

  /**
   * 验证邮件
   * @param payload
   * @returns
   */
  @ApiOperation({ summary: '验证邮箱' })
  @Post('/verifyEmail')
  async verifyEmail(@Body() payload: VerifyEmailDto, @Req() req: Request) {
    const { user } = req as any;
    return await this.emailService.verify(user.id, payload.code);
  }
}

@ApiTags('管理平台-用户管理')
@Controller('admin/user')
export class AdminUserController {
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

  @UseGuards(JwtAuthGuard)
  @Post('update')
  @ApiBody({ type: User })
  update(@Body() param) {
    return this.userService.update(param);
  }

  @ApiOperation({ summary: '查看用户详情' })
  @ApiBody({ type: QueryDetailDto })
  @ApiResponse({ type: User })
  @Post('detail')
  detail(@Body() param: QueryDetailDto) {
    return this.userService.findById(param.id);
  }
}
