import { UsuarioService } from './usuario.service'; 
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { Usuario } from './usuario.entity'; 
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';  
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { util } from 'src/utils/controller.util';  

@Controller('usuario')
export class UsuarioController {
    constructor(private usuarioService:UsuarioService){}
    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiBearerAuth('access-token')
    @ApiOperation({summary: util.sumario.findAll('usuario')})
    findAll(): Promise<Usuario[]> {
        return this.usuarioService.findAll();
    }
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiBearerAuth('access-token')
    @ApiOperation({summary: util.sumario.findById('usuario')})
    async find(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
        return this.usuarioService.find(id)
    }
    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiBearerAuth('access-token')
    @ApiOperation({summary: util.sumario.post('usuario'), description: `Segue informações dos seguintes campos: \n + usuario: obrigatório, unico e minimo 2 dígitos \n + senha: obrigatorio e minimo 3 dígitos \n + ativo: opcional e valor padrão é true`})
    async create(@Body() body: Usuario): Promise<Usuario> {
        return this.usuarioService.create(body)
    }
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    @ApiBearerAuth('access-token')
    @ApiOperation({summary: util.sumario.update('usuario'), description: `Segue informações dos seguintes campos: \n + usuario: obrigatório, unico e minimo 2 dígitos \n + senha: obrigatorio e minimo 3 dígitos \n + ativo: opcional e valor padrão é true`})
    udpate(@Param('id', ParseIntPipe) id: number, @Body() body: Usuario) {
        return this.usuarioService.update(id, body);
    }
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiBearerAuth('access-token')
    @ApiOperation({summary: util.sumario.delete('usuario')})
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.usuarioService.delete(id);
    }
}
