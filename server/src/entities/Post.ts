import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import BaseEntity from "./Entity";
import Sub from "./Sub";
import { User } from "./User";
import { Exclude, Expose } from "class-transformer";
import { makeId } from "../utils/helpers";
import Vote from "./Vote";
import Comment from "./Comment";
import { slugify } from "transliteration";

@Entity("posts")
export default class Post extends BaseEntity {
  @Index()
  @Column()
  identifier: string;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column({ nullable: true, type: "text" }) // 내용이 없어도 등록 가능
  body: string;

  @Column()
  subName: string;

  @Column()
  username: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: "subName", referencedColumnName: "name" })
  sub: Sub;

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.post)
  votes: Vote[];

  @Expose() get url(): string {
    return `/p/${this.subName}/${this.identifier}/${this.slug}`;
  }

  @Expose() get commentCount(): number {
    // 댓글수
    return this.comments?.length;
  }

  @Expose() get voteScore(): number {
    // 투표수
    return this.votes?.reduce((memo, curt) => memo + (curt.value || 0), 0);
  }

  protected userVote: number;

  setUserVote(user: User) {
    // votes테이블에서 찾고자 하는 username값이 존재하면 value값 반환
    const index = this.votes?.findIndex((v) => v.username === user.username);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @BeforeInsert()
  makeIdAndSlug() {
    // utils에 생성한 함수로 변환된 랜덤id와 제목slug를 삽입
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}
