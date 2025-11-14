import { MigrationInterface, QueryRunner } from "typeorm";

export class AddResetTokenToUsers1763144877988 implements MigrationInterface {
    name = 'AddResetTokenToUsers1763144877988'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "FK_c11440763f0b7425073f994d407"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "resetToken" character varying(6)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "resetTokenExpiresAt" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "resetTokenExpiresAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "resetToken"`);
        await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "FK_c11440763f0b7425073f994d407" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
