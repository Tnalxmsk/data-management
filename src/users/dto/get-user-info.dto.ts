import { CreateUserRequestDto } from './create-user-request.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GetUserInfoDto extends PickType(CreateUserRequestDto, [
  'name',
  'email',
  'phone',
]) {
  @IsNumber()
  @ApiProperty({
    description: '유저 인덱스',
    example: '1',
  })
  id: number;
}
