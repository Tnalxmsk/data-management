import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequestDto {
  @IsEmail()
  @ApiProperty({
    description: '이메일',
    example: 'test1234@navr.com',
    required: true,
  })
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({
    description: '비밀번호',
    example: '12345678@',
    required: true,
  })
  password: string;

  @IsString()
  @ApiProperty({
    description: '이름',
    example: '장민수',
    required: true,
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: '휴대폰 번호',
    example: '010-1234-5678',
    required: true,
  })
  phone: string;
}
