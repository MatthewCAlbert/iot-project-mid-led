import { Entity, Column } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity()
export class Schedule extends BaseEntity {
    @Column()
    name: string;

    @Column()
    command: string;

    @Column()
    when: Date;
}