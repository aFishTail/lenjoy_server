import { ApiProperty } from '@nestjs/swagger';

export class UploadArticleImageInputDto {
  @ApiProperty()
  file: any;
}
