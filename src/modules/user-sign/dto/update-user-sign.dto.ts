import { PartialType } from '@nestjs/swagger';
import { CreateUserSignDto } from './create-user-sign.dto';

export class UpdateUserSignDto extends PartialType(CreateUserSignDto) {}
