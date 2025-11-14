import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTenantToLinks1763133875741 implements MigrationInterface {
    name = 'AddTenantToLinks1763133875741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" ADD "tenantId" integer`);
        await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "FK_c11440763f0b7425073f994d407" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "FK_c11440763f0b7425073f994d407"`);
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "tenantId"`);
    }

}
