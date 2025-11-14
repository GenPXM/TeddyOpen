import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTenantToUsers1763133691890 implements MigrationInterface {
    name = 'AddTenantToUsers1763133691890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "tenantId" integer`);
        await queryRunner.query(`ALTER TABLE "tenants" DROP CONSTRAINT "UQ_2310ecc5cb8be427097154b18fc"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2310ecc5cb8be427097154b18f" ON "tenants" ("slug") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_c58f7e88c286e5e3478960a998b" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_c58f7e88c286e5e3478960a998b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2310ecc5cb8be427097154b18f"`);
        await queryRunner.query(`ALTER TABLE "tenants" ADD CONSTRAINT "UQ_2310ecc5cb8be427097154b18fc" UNIQUE ("slug")`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tenantId"`);
    }

}
