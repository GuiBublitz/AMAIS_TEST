import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(email, pass): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && this.validatePassword(pass, user.senha)) {
      const { senha, ...result } = user;
      return result;
    }
    return null;
  }

  private validatePassword(password: string, storedPassword: string): boolean {
    const [salt, hash] = storedPassword.split(':');
    const hashToVerify = crypto
      .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
      .toString(`hex`);
    return hash === hashToVerify;
  }
}
