import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { IUserWithoutPassword } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<IUserWithoutPassword | null> {
    return await this.usersService.validateUser(email, password);
  }

  async login(user: IUserWithoutPassword) {
    const payload = { 
      email: user.email, 
      sub: user.id,
      role: user.role 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async getCurrentUser(userId: string): Promise<IUserWithoutPassword> {
    return await this.usersService.findOne(userId);
  }
}
