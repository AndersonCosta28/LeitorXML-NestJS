import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as bcrypt from 'bcrypt';
import { createDecipheriv } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsuarioService,
    private jwtService: JwtService
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const newPass = Buffer.from(pass, 'hex');
    const decipher = createDecipheriv('aes-256-ctr', '1b4de2c5fd632cd8fc6bb176bb3f4bc3', Buffer.from('b4de776a4a8e286e7cd14fb673cbac3f', 'hex'));
    const decryptedText = Buffer.concat([
      decipher.update(newPass),
      decipher.final(),
    ]);
    console.log(decryptedText.toString())


    const user = await this.usersService.findOne(username);
    if (user && await bcrypt.compare(decryptedText.toString(), user.senha) /* Verifica se a senha passada é a mesma do banco*/) {
      const { senha, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { usuario: user.usuario, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}