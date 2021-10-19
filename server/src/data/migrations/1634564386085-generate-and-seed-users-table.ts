import { nanoid } from "nanoid";
import {getRepository, MigrationInterface, QueryRunner} from "typeorm";
import utils from "../../utils/jwt";
import { User } from "../entities/user.entity";

export class generateAndSeedUsersTable1634564386085 implements MigrationInterface {
    name = 'generateAndSeedUsersTable1634564386085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar(20) PRIMARY KEY NOT NULL, "created_at" datetime DEFAULT (datetime('now')), "updated_at" datetime DEFAULT (datetime('now')), "username" varchar NOT NULL, "name" varchar NOT NULL, "hash" varchar NOT NULL, "salt" varchar NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"))`);
        
        await this.seed();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

    private async seed(): Promise<void> {
        const pwd = utils.genPassword("password");

        await getRepository(User).save([
        {
            id: nanoid(),
            username: "admin",
            name: "Admin",
            hash: pwd.hash,
            salt: pwd.salt
        },
        ] as User[]);
    }

}
