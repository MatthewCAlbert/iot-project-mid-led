import {MigrationInterface, QueryRunner} from "typeorm";

export class createScheduleTable1634626715609 implements MigrationInterface {
    name = 'createScheduleTable1634626715609'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "schedule" ("id" varchar(21) PRIMARY KEY NOT NULL, "created_at" datetime DEFAULT (datetime('now')), "updated_at" datetime DEFAULT (datetime('now')), "name" varchar NOT NULL, "command" varchar NOT NULL, "when" datetime NOT NULL, "userIdId" varchar(21), CONSTRAINT "UQ_edfc66480c36fb0b3e240c8816f" UNIQUE ("when"))`);
        await queryRunner.query(`CREATE TABLE "temporary_schedule" ("id" varchar(21) PRIMARY KEY NOT NULL, "created_at" datetime DEFAULT (datetime('now')), "updated_at" datetime DEFAULT (datetime('now')), "name" varchar NOT NULL, "command" varchar NOT NULL, "when" datetime NOT NULL, "userIdId" varchar(21), CONSTRAINT "UQ_edfc66480c36fb0b3e240c8816f" UNIQUE ("when"), CONSTRAINT "FK_4573cb923647cdcb9966d4b4300" FOREIGN KEY ("userIdId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_schedule"("id", "created_at", "updated_at", "name", "command", "when", "userIdId") SELECT "id", "created_at", "updated_at", "name", "command", "when", "userIdId" FROM "schedule"`);
        await queryRunner.query(`DROP TABLE "schedule"`);
        await queryRunner.query(`ALTER TABLE "temporary_schedule" RENAME TO "schedule"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule" RENAME TO "temporary_schedule"`);
        await queryRunner.query(`CREATE TABLE "schedule" ("id" varchar(21) PRIMARY KEY NOT NULL, "created_at" datetime DEFAULT (datetime('now')), "updated_at" datetime DEFAULT (datetime('now')), "name" varchar NOT NULL, "command" varchar NOT NULL, "when" datetime NOT NULL, "userIdId" varchar(21), CONSTRAINT "UQ_edfc66480c36fb0b3e240c8816f" UNIQUE ("when"))`);
        await queryRunner.query(`INSERT INTO "schedule"("id", "created_at", "updated_at", "name", "command", "when", "userIdId") SELECT "id", "created_at", "updated_at", "name", "command", "when", "userIdId" FROM "temporary_schedule"`);
        await queryRunner.query(`DROP TABLE "temporary_schedule"`);
        await queryRunner.query(`DROP TABLE "schedule"`);
    }

}
