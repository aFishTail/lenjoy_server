import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ResourceService } from './resource.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { PrimaryKeyDto } from 'src/common/base.dto';
import { QueryUser } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QueryResourceDto } from './dto/query-resource.dto';
import { EntityAuth, EntityAuthGuard } from '../auth/entity.guard';
import { Resource } from './entities/resource.entity';

@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  create(
    @Body() createResourceDto: CreateResourceDto,
    @QueryUser('id') userId,
  ) {
    return this.resourceService.create(createResourceDto, userId);
  }

  @Post('query')
  queryPage(
    @Body() queryResourceDto: QueryResourceDto,
    @QueryUser('id') userId,
  ) {
    return this.resourceService.queryPage(queryResourceDto, userId);
  }

  @UseGuards(JwtAuthGuard, EntityAuthGuard)
  @EntityAuth(Resource, 'id')
  @Post('/update')
  update(@Body() updateResourceDto: UpdateResourceDto) {
    return this.resourceService.update(updateResourceDto);
  }

  @Post('detail')
  findOne(@Body() payload: PrimaryKeyDto) {
    return this.resourceService.findOne(payload.id);
  }

  @UseGuards(JwtAuthGuard, EntityAuthGuard)
  @EntityAuth(Resource, 'id')
  @Post('delete')
  remove(@Body() payload: PrimaryKeyDto) {
    return this.resourceService.remove(payload.id);
  }
}
