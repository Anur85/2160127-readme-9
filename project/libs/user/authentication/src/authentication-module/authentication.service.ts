import { ConflictException,  Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BlogUserRepository, BlogUserEntity } from '@project/blog-user';


import { CreateUserDto } from '../dto/create-user.dto';
import { AuthUserErrorMessage } from './authentication.constant';
import { LoginUserDto } from '../dto/login-user.dto';

@Injectable()
export class AuthenticationService {
  constructor(
   private readonly blogUserRepository: BlogUserRepository,

      private readonly configService: ConfigService,
  ) {
    // Извлекаем настройки из конфигурации
    console.log(configService.get<string>('db.host'));
    console.log(configService.get<string>('db.user'));
  }
  public async register(dto: CreateUserDto): Promise<BlogUserEntity> {
    const {email, name, password} = dto;

    const blogUser = {
      email, name,
      avatar: '',
      passwordHash: ''
    };

    const existUser = await this.blogUserRepository
      .findByEmail(email);

    if (existUser) {
      throw new ConflictException(AuthUserErrorMessage.AuthUserExists);
    }

    const userEntity = await new BlogUserEntity(blogUser)
      .setPassword(password)

    this.blogUserRepository
      .save(userEntity);

    return userEntity;
  }

  public async verifyUser(dto: LoginUserDto) {
    const {email, password} = dto;
    const existUser = await this.blogUserRepository.findByEmail(email);

    if (!existUser) {
      throw new NotFoundException(AuthUserErrorMessage.AuthUserNotFound);
    }

    if (!await existUser.comparePassword(password)) {
      throw new UnauthorizedException(AuthUserErrorMessage.AuthUserPasswordWrong);
    }

    return existUser;
  }

  public async getUser(id: string) {
    const user = await this.blogUserRepository.findById(id);

    if (! user) {
      throw new NotFoundException(AuthUserErrorMessage.AuthUserNotFound);
    }

    return user;
  }
}
