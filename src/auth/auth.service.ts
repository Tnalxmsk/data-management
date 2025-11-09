import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/login-user.dto';
import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_EXPIRED,
  JWT_SECRET,
  REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRED,
} from './const/token';
import { ExistUserDto } from './dto/exist-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  signToken(user: ExistUserDto, isRefresh: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefresh ? REFRESH_TOKEN : ACCESS_TOKEN,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(JWT_SECRET),
      expiresIn: isRefresh
        ? this.configService.get(REFRESH_TOKEN_EXPIRED)
        : this.configService.get(ACCESS_TOKEN_EXPIRED),
    });
  }

  private loginUser(body: ExistUserDto) {
    return {
      access_token: this.signToken(body, false),
      refresh_token: this.signToken(body, false),
    };
  }

  async registerUser(body: RegisterUserDto) {
    const hash = await bcrypt.hash(
      body.password,
      parseInt(this.configService.get<string>(process.env.HASH_ROUNDS)),
    );

    const newUser = await this.usersService.createUser({
      ...body,
      password: hash,
    });

    return this.loginUser(newUser);
  }

  extractTokenFromHeader(header: string) {
    if (!header) {
      throw new UnauthorizedException('리프레쉬 토큰이 존재하지 않습니다.');
    }

    const splitToken = header.split(' ');
    const hasPrefix = splitToken[0] === 'Bearer';

    if (hasPrefix || splitToken.length !== 2) {
      throw new UnauthorizedException('올바르지 않은 토큰입니다.');
    }

    return splitToken[1];
  }

  async loginWithEmail(user: { email: string; password: string }) {
    const existingUser = await this.authenticateWithEmailAndPassword(user);
    return this.loginUser(existingUser);
  }

  private async authenticateWithEmailAndPassword(
    user: Pick<LoginUserDto, 'email' | 'password'>,
  ) {
    const existingUser = await this.usersService.getUserByEmail(user.email);

    if (!existingUser) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    const passOk = await bcrypt.compare(user.password, existingUser.password);

    if (!passOk) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다');
    }

    return existingUser;
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>(JWT_SECRET),
      });
    } catch (e) {
      throw new UnauthorizedException(
        `${e} - 토큰이 만료되었거나 잘못된 토큰입니다.`,
      );
    }
  }
}
