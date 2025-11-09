import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersModel } from './entities/users.entity';

@ApiTags('유저')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '유저 생성' })
  @ApiBody({
    type: CreateUserRequestDto,
    description: '유저 생성 Request Body',
    required: true,
  })
  @ApiResponse({
    type: UsersModel,
  })
  postUser(@Body() createUserDto: CreateUserRequestDto) {
    return this.usersService.createUser(createUserDto);
  }
}
