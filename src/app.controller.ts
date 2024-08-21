import {
  Controller,
  Render,
  Get,
  Post,
  Put,
  Body,
  Res,
  HttpStatus,
  UseGuards,
  Request,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UpdateUserDto } from './users/dto/update-user.dto';
import { Response } from 'express';
import { ConflictException } from './exceptions/conflict.exception';
import { LoginGuard } from './common/guards/login.guard';
import { AuthenticatedGuard } from './common/guards/authenticated.guard';

@Controller()
export class AppController {
  constructor(private readonly usersService: UsersService) { }

  @Get('/')
  @Render('index')
  async renderMain(@Request() req) {
    const isAuthenticated = req.isAuthenticated();
    const user = req.user;

    let curriculoData = null;

    if (isAuthenticated && user?.email) {
      curriculoData = await this.usersService.findByEmail(user.email);
    }

    return {
      isAuthenticated,
      user,
      curriculoData,
    };
  }

  @Get('/login')
  @Render('login')
  renderLogin(): string {
    return '';
  }

  @UseGuards(LoginGuard)
  @Post('/login')
  async checkLogin(@Res() res: Response) {
    return res.status(200).redirect('/');
  }

  @Get('/logout')
  logout(@Request() req, @Res() res: Response) {
    req.logout(() => {
      res.redirect('/login');
    });

  }

  @Post('/createUser')
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response, @Request() req) {
    try {
      const user = await this.usersService.createUser(createUserDto);
      if (user) {
        return res.status(HttpStatus.CREATED).json({
          success: true,
          message: 'Usuário registrado e logado com sucesso',
          user,
        });
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        return res
          .status(HttpStatus.CONFLICT)
          .json({ success: false, message: error.message });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Ocorreu um erro ao registrar o usuário',
      });
    }
  }

  @Put('/updateUser/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/admin')
  @Render('admin')
  async renderAdmin(@Request() req) {
    const isAuthenticated = req.isAuthenticated();
    const user = req.user;

    const allUsers = await this.usersService.findAllUsers();

    return {
      isAuthenticated,
      user,
      allUsers,
    };
  }

}
