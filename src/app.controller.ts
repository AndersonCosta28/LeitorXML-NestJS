import { Controller, Get, Request, Post, UseGuards, Body, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { Usuario } from './usuario/usuario.entity';

@Controller()
export class AppController {
  constructor(private authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: Usuario })
  @ApiOperation({ summary: "Essa rota é para fazer o login", description: "Entre com usuário e senha válido, ele retornará um Token para ser usado para acessar as outras rotas" }) // https://stackoverflow.com/questions/60114023/how-to-add-summary-and-body-manually-in-swagger-nestjs
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({summary:"Retorna dados do usuário corrente da requisição"})
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}