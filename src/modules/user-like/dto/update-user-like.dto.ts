import { PartialType } from '@nestjs/swagger';
import { CreateUserLikeDto } from './create-user-like.dto';

export class UpdateUserLikeDto extends PartialType(CreateUserLikeDto) {}
