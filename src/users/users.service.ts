import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { GetUserInfoDto } from './dto/get-user-info.dto';

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

  async getUser(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`존재하지 않는 유저 id입니다. id: ${id}`);
    }

    const userInfo: GetUserInfoDto = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
    };

    return userInfo;
  }

  async deleteUser(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(
        `선택한 유저 정보를 찾을 수 없습니다. id: ${id}`,
      );
    }

    await this.usersRepository.delete(id);

    return id;
  }
}
