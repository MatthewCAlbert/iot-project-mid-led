import { Entity, Column } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity()
export class User extends BaseEntity {
    @Column({ unique: true })
    username: string;

    @Column()
    name: string;

    @Column()
    hash: string;

    @Column()
    salt: string;
}