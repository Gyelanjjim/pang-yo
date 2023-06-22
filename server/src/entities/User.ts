import { IsEmail, Length } from "class-validator";
import { Entity, Column, Index, OneToMany, BeforeInsert } from "typeorm";
import BaseEntity from "./Entity";
import bcrypt from "bcryptjs";
import Vote from "./Vote";
import Post from "./Post";

@Entity("users")
export class User extends BaseEntity {
  @Index() // 빈번한 검색이 발생하는 경우 Index데코를 쓰면 속도가 빠르다
  @IsEmail(undefined, { message: "이메일 주소가 잘못되었습니다" })
  @Length(1, 255, { message: "이메일 주소는 비워둘 수 없습니다" })
  @Column({ unique: true })
  email: string; // 빨간 줄을 없애기 위해 non-null assertion operator(!)를 붙였는데 dto를 나중에 선언할 것.

  @Index({ unique: true })
  @Length(3, 32, { message: "사용자 이름은 3글자 이상이어야 합니다" })
  @Column({ unique: true })
  username: string;

  @Column()
  @Length(6, 255, { message: "비밀번호는 6자리 이상입니다" })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }
}
