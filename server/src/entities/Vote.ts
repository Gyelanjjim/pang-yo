import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import BaseEntity from "./Entity";
import { User } from "./User";
import Post from "./Post";
import Comment from "./Comment";

@Entity("votes")
export default class Vote extends BaseEntity {
  @Column() // 좋아요 1 or 싫어요 -1
  value: number;

  @ManyToOne(() => User) // 투표한 유저
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @Column()
  username: string;

  @Column({ nullable: true }) // 댓글 투표 시 null
  postId: number;

  @Column({ nullable: true }) // 게시글 투표 시 null
  commentId: number;

  @ManyToOne(() => Post)
  post: Post;

  @ManyToOne(() => Comment)
  comment: Comment;
}
