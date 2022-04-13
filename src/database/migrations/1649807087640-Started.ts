import {MigrationInterface, QueryRunner} from "typeorm";

export class Started1649807087640 implements MigrationInterface {
    name = 'Started1649807087640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "usuario" ("id" SERIAL NOT NULL, "usuario" character varying NOT NULL, "senha" character varying NOT NULL, "ativo" boolean NOT NULL DEFAULT true, "criado_em" TIMESTAMP NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9921cd8ed63a072b8f93ead80f0" UNIQUE ("usuario"), CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "usuario"`);
    }

}
