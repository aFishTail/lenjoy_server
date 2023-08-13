import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateResourceDto } from './create-resource.dto';
import { IsUUID } from 'class-validator';

export class UpdateResourceDto extends PartialType(CreateResourceDto) {
  @ApiProperty()
  @IsUUID()
  id: string;
}
