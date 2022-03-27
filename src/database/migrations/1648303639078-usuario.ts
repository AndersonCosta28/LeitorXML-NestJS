import {MigrationInterface, QueryRunner} from "typeorm";

export class usuario1648303639078 implements MigrationInterface {
    name = 'usuario1648303639078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "usuario" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "usuario" varchar NOT NULL, "senha" varchar NOT NULL, "ativo" boolean NOT NULL DEFAULT (1), "criado_em" datetime NOT NULL DEFAULT (datetime('now')), "atualizado_em" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_9921cd8ed63a072b8f93ead80f0" UNIQUE ("usuario"))`);
        await queryRunner.query(`INSERT INTO usuario(usuario,senha) VALUES ('ADMIN', '$2b$10$G0lyL19NCj4yWw6nj.MgrukcMNGe8ZAxPDQDJa3F/mv99bsZQoZ3e')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "usuario"`);
    }

}
