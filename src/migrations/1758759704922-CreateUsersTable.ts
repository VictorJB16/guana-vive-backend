import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1758759704922 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying(100) NOT NULL,
                "password" character varying(255) NOT NULL,
                "firstName" character varying(50) NOT NULL,
                "lastName" character varying(50) NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                "role" character varying NOT NULL DEFAULT 'user',
                "phone" character varying(20),
                "avatar" character varying(500),
                "bio" text,
                "dateOfBirth" date,
                "address" character varying(255),
                "city" character varying(100),
                "country" character varying(100),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_users_isActive" ON "users" ("isActive")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_users_role" ON "users" ("role")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_users_role"`);
        await queryRunner.query(`DROP INDEX "IDX_users_isActive"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
