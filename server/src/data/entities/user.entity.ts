import { Entity, Column, OneToMany } from "typeorm";
import BaseEntity from "./base.entity";
import { Schedule } from "./schedule.entity";

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

    @OneToMany(() => Schedule, schedule => schedule.user)
    schedules: Schedule[];
}