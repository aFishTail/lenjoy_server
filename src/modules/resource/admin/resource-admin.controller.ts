import { UseGuards, Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrimaryKeyDto, ResponseDto } from 'src/common/base.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { Roles, RolesGuard } from 'src/modules/auth/roles.guard';
import { QueryTopicDetailOutDto } from 'src/modules/topic/dto/detail-topic.dto';
import { QueryResourceAdminInputDto } from './dto/query-resource-admin.dto';
import { ResourceAdminService } from './resource-admin.service';

@ApiTags('管理平台-资源管理')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/resource')
export class ResourceAdminController {
  constructor(private readonly resourceAdminService: ResourceAdminService) {}

  @ApiOperation({ summary: '查询资源列表' })
  @Post('/list')
  findAll(@Body() payload: QueryResourceAdminInputDto) {
    return this.resourceAdminService.findAll(payload);
  }

  @ApiOperation({ summary: '查询资源详情' })
  @ApiResponse({ type: QueryTopicDetailOutDto })
  @Post('/detail')
  async detail(@Body() param: PrimaryKeyDto) {
    const { id } = param;
    const topic = await this.resourceAdminService.findOne(id);
    return topic;
  }

  @ApiOperation({ summary: '删除资源' })
  @ApiResponse({ type: ResponseDto })
  @Post('/delete')
  remove(@Body() payload: PrimaryKeyDto) {
    return this.resourceAdminService.remove(payload.id);
  }
}
