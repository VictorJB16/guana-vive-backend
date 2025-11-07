import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePublicationsTable1758760000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tipos ENUM
    await queryRunner.query(`
      CREATE TYPE "publication_category_enum" AS ENUM (
        'danza',
        'gastronomia',
        'retahilero',
        'artista_local',
        'grupo_musica'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "publication_status_enum" AS ENUM (
        'borrador',
        'publicado',
        'archivado',
        'pendiente_revision'
      )
    `);

    // Crear tabla publications
    await queryRunner.query(`
      CREATE TABLE "publications" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying(200) NOT NULL,
        "content" text NOT NULL,
        "category" "publication_category_enum" NOT NULL,
        "status" "publication_status_enum" NOT NULL DEFAULT 'borrador',
        "authorId" uuid NOT NULL,
        "imageUrl" character varying(500),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_publications_id" PRIMARY KEY ("id")
      )
    `);

    // Crear índices
    await queryRunner.query(`
      CREATE INDEX "IDX_publications_status" ON "publications" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_publications_category" ON "publications" ("category")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_publications_authorId" ON "publications" ("authorId")
    `);

    // Crear foreign key constraint hacia la tabla users
    await queryRunner.query(`
      ALTER TABLE "publications"
      ADD CONSTRAINT "FK_publications_author"
      FOREIGN KEY ("authorId")
      REFERENCES "users"("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar foreign key
    await queryRunner.query(
      `ALTER TABLE "publications" DROP CONSTRAINT "FK_publications_author"`,
    );

    // Eliminar índices
    await queryRunner.query(`DROP INDEX "IDX_publications_authorId"`);
    await queryRunner.query(`DROP INDEX "IDX_publications_category"`);
    await queryRunner.query(`DROP INDEX "IDX_publications_status"`);

    // Eliminar tabla
    await queryRunner.query(`DROP TABLE "publications"`);

    // Eliminar tipos ENUM
    await queryRunner.query(`DROP TYPE "publication_status_enum"`);
    await queryRunner.query(`DROP TYPE "publication_category_enum"`);
  }
}
