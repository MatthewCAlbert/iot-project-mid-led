import { nanoid } from 'nanoid';
import { CreateDateColumn,UpdateDateColumn, PrimaryColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryColumn("varchar", {
    length: 21
  })
  id: string;
  
  // @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  // public created_at: Date;

  // @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  // public updated_at: Date;
  
  @CreateDateColumn({ type: "datetime", nullable: true })
  public created_at: Date;

  @UpdateDateColumn({ type: "datetime", nullable: true })
  public updated_at: Date;

  @BeforeInsert()
  beforeInsert() {
    this.id = nanoid();
    this.updated_at = new Date();
    this.created_at = new Date();
  }

  @BeforeUpdate()
  beforeUpdate(){
    this.updated_at = new Date();
  }
}