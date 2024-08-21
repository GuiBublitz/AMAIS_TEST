import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as crypto from 'crypto';
import { ConflictException } from '../exceptions/conflict.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async findAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { senha, pretencao_salarial, email, cpf, ...userData } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: [{ email }, { cpf }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('Email já existe');
      }
      if (existingUser.cpf === cpf) {
        throw new ConflictException('CPF já existe');
      }
    }

    const hashedPassword = this.hashPassword(senha);

    const user: DeepPartial<User> = {
      ...userData,
      email,
      cpf,
      senha: hashedPassword,
      pretencao_salarial: Number(pretencao_salarial),
    };

    return this.usersRepository.save(user as User);
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findUserById(id);
  
    Object.assign(user, updateUserDto);
  
    return this.usersRepository.save(user);
  }
  

  private hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
      .toString(`hex`);
    return `${salt}:${hash}`;
  }
}
