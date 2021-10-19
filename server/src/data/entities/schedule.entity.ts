import { Entity, Column, ManyToOne } from "typeorm";
import BaseEntity from "./base.entity";
import { User } from "./user.entity";

@Entity()
export class Schedule extends BaseEntity {
    @ManyToOne(() => User, user => user.schedules)
    user_id: string;

    @Column()
    name: string;

    @Column()
    command: string;

    @Column({ unique: true })
    when: Date;
}