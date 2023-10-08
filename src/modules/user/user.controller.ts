import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  SetEmailDto,
  UpdateUserBasicDto,
  UpdateUserPasswordDto,
} from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryUserDetailOutDto, QueryUserInputDto } from './dto/query-user.dto';
import { PrimaryKeyDto } from 'src/common/base.dto';
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
  @ApiBody({ type: UpdateUserBasicDto })
  @UseGuards(JwtAuthGuard)
  @Post('update/basic')
  updateBasic(@Body() param: UpdateUserBasicDto, @QueryUser('id') id) {
    return this.userService.update({ ...param, id });
  }

  @ApiOperation({ summary: '查看用户详情' })
  @ApiResponse({ type: QueryUserDetailOutDto })
  @Post('detail')
  detail(@Body() param: PrimaryKeyDto) {
    return this.userService.findById(param.id);
  }

  @ApiOperation({ summary: '修改密码' })
  @Post('updatePassword')
  remove(@Body() payload: UpdateUserPasswordDto, @QueryUser('id') id) {
    return this.userService.updatePassword({ ...payload, id });
  }

  @ApiOperation({ summary: '设置邮箱' })
  @ApiBody({ type: SetEmailDto })
  @UseGuards(JwtAuthGuard)
  @Post('setEmail')
  async setEmail(@Body() payload: SetEmailDto, @QueryUser('id') userId) {
    return await this.userService.setEmail(userId, payload.email);
  }

  /**
   * 验证邮件
   * @param payload
   * @returns
   */
  @ApiOperation({ summary: '验证邮箱' })
  @Post('/verifyEmail')
  async verifyEmail(@Body() payload: VerifyEmailDto, @QueryUser('id') userId) {
    return await this.emailService.verify(userId, payload.code);
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

  @UseGuards(JwtAuthGuard)
  @Post('updateBasic')
  @ApiBody({ type: User })
  updateBasic(@Body() param) {
    return this.userService.update(param);
  }

  @ApiOperation({ summary: '查看用户详情' })
  @ApiResponse({ type: User })
  @Post('detail')
  detail(@Body() param: PrimaryKeyDto) {
    return this.userService.findById(param.id);
  }
}
