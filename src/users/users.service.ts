import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserRequestDto } from './dto/create-user-request.dto';

/**
 * 유저 생성
 * 유저 정보 조회
 * 유저 삭제
 * 유저 정보 업데이트
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) {}

  // 유저를 생성합니다.
  async createUser(createUserDto: CreateUserRequestDto) {
    const emailExists = await this.usersRepository.exists({
      where: { email: createUserDto.email },
    });

    if (emailExists) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const user = this.usersRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      phone: createUserDto.phone,
    });

    return await this.usersRepository.save(user);
  }
}
