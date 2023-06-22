import { Expose } from "class-transformer";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import Post from "./Post";
import { User } from "./User";
import BaseEntity from "./Entity";

@Entity("subs")
export default class Sub extends BaseEntity {
  @Index()
  @Column({ unique: true })
  name: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true }) // 내용이 없어도 등록 가능
  description: string;

  @Column({ nullable: true }) // 프로필사진이 없어도 등록가능
  imageUrn: string;

  @Column({ nullable: true }) // 배너사진이 없어도 등록가능
  bannerUrn: string;

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @OneToMany(() => Post, (post) => post.sub)
  posts: Post[];

  @Expose() // http메소드를 쓸 때 필요한 데코
  get imageUrl(): string {
    return this.imageUrn
      ? `${process.env.APP_URL}/images/${this.imageUrn}`
      : "https://www.gravatar.com/avatar?d=mp&f=y";
  }

  @Expose()
  get bannerUrl(): string {
    return this.bannerUrn
      ? `${process.env.APP_URL}/images/${this.bannerUrn}`
      : ""; // 강의에서 undefined를 썼지만 string형식이어야 하므로 falsy값으로 수정.
  }
}
