import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResourceService } from './resource.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { PrimaryKeyDto } from 'src/common/base.dto';
import { QueryUser } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EntityAuth, EntityAuthGuard } from '../auth/entity.guard';
import { Resource } from './entities/resource.entity';
import { QueryResourceInputDto } from './dto/query-resource.dto';
import { FirstPostInterceptor } from 'src/interceptors/firstPost.interceptor';
import { EmailVerifyInterceptor } from 'src/interceptors/emailVerify.interceptor';

@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(EmailVerifyInterceptor, FirstPostInterceptor)
  @Post('/create')
  create(
    @Body() createResourceDto: CreateResourceDto,
    @QueryUser('id') userId,
  ) {
    return this.resourceService.create(createResourceDto, userId);
  }

  @Post('query')
  queryPage(
    @Body() queryResourceDto: QueryResourceInputDto,
    @QueryUser('id') userId,
  ) {
    return this.resourceService.queryPage(queryResourceDto, userId);
  }

  @Post('query/findOne')
  queryFindOne(@Body() { id }: PrimaryKeyDto, @QueryUser('id') userId) {
    return this.resourceService.queryOne(id, userId);
  }

  @UseGuards(JwtAuthGuard, EntityAuthGuard)
  @EntityAuth(Resource, 'id')
  @Post('/update')
  update(@Body() updateResourceDto: UpdateResourceDto) {
    return this.resourceService.update(updateResourceDto);
  }

  @Post('detail')
  async findOne(@Body() { id }: PrimaryKeyDto, @QueryUser('id') userId) {
    const reward = await this.resourceService.findOne(id, userId);
    await this.resourceService.incrViewCount(id);
    return reward;
  }

  @UseGuards(JwtAuthGuard, EntityAuthGuard)
  @EntityAuth(Resource, 'id')
  @Post('delete')
  remove(@Body() payload: PrimaryKeyDto) {
    return this.resourceService.remove(payload.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('pay')
  pay(@Body() payload: PrimaryKeyDto, @QueryUser('id') userId: string) {
    return this.resourceService.pay(payload.id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('viewResourceUrl')
  viewResourceUrl(
    @Body() payload: PrimaryKeyDto,
    @QueryUser('id') userId: string,
  ) {
    return this.resourceService.viewResourceUrl(payload.id, userId);
  }
}
