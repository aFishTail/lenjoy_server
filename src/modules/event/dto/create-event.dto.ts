import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateEventDto {
  @ApiProperty()
  @IsNotEmpty()
  fromType: string;

  @ApiProperty()
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  @ApiProperty()
  content: string;

  @IsNotEmpty()
  @ApiProperty()
  entityType: string;

  @IsNotEmpty()
  @ApiProperty()
  entityId: string;

  @IsNotEmpty()
  @ApiProperty()
  fromUserId: string;

  @IsNotEmpty()
  @ApiProperty()
  toUserId: string;
}
