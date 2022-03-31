import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true, nullable: false })
    @IsString()     //Validação na hora de vir na requisição
    @Length(4, 14)  //Validação na hora de vir na requisição
    @IsString()     //Validação na hora de vir na requisição
    @IsNotEmpty()
    usuario: string

    @Column({ type: "varchar", nullable: false, })
    @IsString()    //Validação na hora de vir na requisição
    @Length(6, 24) //Validação na hora de vir na requisição
    @IsNotEmpty()
    senha: string;

    @Column({ nullable: false, default: true })
    @IsBoolean()   //Validação na hora de vir na requisição
    @IsOptional()  //Validação na hora de vir na requisição
    ativo: boolean;

    @CreateDateColumn()
    criado_em: Date;

    @UpdateDateColumn()
    atualizado_em: Date;

    @BeforeInsert()
    insertToUpperCase() {
        const salt = bcrypt.genSaltSync(10);
        this.senha = bcrypt.hashSync(this.senha, salt);
        this.usuario = this.usuario.toUpperCase().trim()
    }

    @BeforeUpdate()
    updateToUpperCase() {
        const salt = bcrypt.genSaltSync(10);
        this.senha = bcrypt.hashSync(this.senha, salt);
        this.usuario = this.usuario.toUpperCase().trim()        
    }
}