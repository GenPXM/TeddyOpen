import { MigrationInterface, QueryRunner } from "typeorm";

export class InitIntIds1762977856448 implements MigrationInterface {
    name = 'InitIntIds1762977856448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying(180) NOT NULL, "password" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE TABLE "links" ("id" SERIAL NOT NULL, "originUrl" character varying(2048) NOT NULL, "code" character varying(6) NOT NULL, "clicks" integer NOT NULL DEFAULT '0', "ownerId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_ecf17f4a741d3c5ba0b4c5ab4b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_52a3fa2a2c27a987ed58fd2ea4" ON "links" ("code") `);
        await queryRunner.query(`CREATE TABLE "clicks" ("id" SERIAL NOT NULL, "linkId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7765d7ffdeb0ed2675651020814" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "FK_a043e1afce454249f5076c1c2ad" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clicks" ADD CONSTRAINT "FK_160968a52da8c4ca7ac1032a087" FOREIGN KEY ("linkId") REFERENCES "links"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clicks" DROP CONSTRAINT "FK_160968a52da8c4ca7ac1032a087"`);
        await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "FK_a043e1afce454249f5076c1c2ad"`);
        await queryRunner.query(`DROP TABLE "clicks"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_52a3fa2a2c27a987ed58fd2ea4"`);
        await queryRunner.query(`DROP TABLE "links"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
