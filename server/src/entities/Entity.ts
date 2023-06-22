import { instanceToInstance, instanceToPlain } from "class-transformer";
import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export default abstract class Entity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  toJSON() {
    // Entity에서 Expose한 부분을 프론트에서 가져오는 방법
    return instanceToPlain(this);
  }
}
