import { ApiProperty } from '@nestjs/swagger';

export class RemoveCategoryInputDto {
  @ApiProperty()
  id: string;
}
