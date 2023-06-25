import { Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import Post from "../entities/Post";
import Sub from "../entities/Sub";
import Comment from "../entities/Comment";
import { AppDataSource } from "../data-source";
import { DataSource, In, Like } from "typeorm";
import { User } from "../entities/User";
import Vote from "../entities/Vote";

const getPosts = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const perPage: number = (req.query.count || 8) as number;

  try {
    const posts = await Post.find({
      order: { createdAt: "DESC" },
      relations: ["sub", "votes", "comments"],
      skip: currentPage * perPage, // 2번째 페이지, 페이지당 8개면 1*8 = 8이니까 8개 스킵한다는 의미
      take: perPage, // 페이지당 몇개를 가져올까
    });

    if (res.locals.user) {
      posts.forEach((p) => p.setUserVote(res.locals.user));
    }

    return res.json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

const getPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  try {
    const post = await Post.findOneOrFail({
      // post 하나를 가져와라
      where: { identifier, slug }, // 조회 조건이 일치하면
      relations: ["sub", "votes"], // join할 테이블들
    });

    if (res.locals.user) {
      post.setUserVote(res.locals.user);
    }

    return res.send(post);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "빵을 찾을 수 없습니다." });
  }
};

const createPost = async (req: Request, res: Response) => {
  const { title, body, sub } = req.body;
  if (title.trim() === "") {
    return res.status(400).json({ title: "제목은 비워둘 수 없습니다." });
  }

  const user = res.locals.user;

  try {
    const subRecord = await Sub.findOneByOrFail({ name: sub });
    const post = new Post();
    post.title = title;
    post.body = body;
    post.user = user;
    post.sub = subRecord;

    await post.save();

    return res.json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

const getPostComments = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  try {
    const post = await Post.findOneByOrFail({ identifier, slug });
    const comments = await Comment.find({
      where: { postId: post.id },
      order: { createdAt: "DESC" },
      relations: ["votes"],
    });
    if (res.locals.user) {
      comments.forEach((c) => c.setUserVote(res.locals.user));
    }
    return res.json(comments);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

const createPostComment = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  const body = req.body.body;
  try {
    const post = await Post.findOneByOrFail({ identifier, slug });
    const comment = new Comment();
    comment.body = body;
    comment.user = res.locals.user;
    comment.post = post;

    if (res.locals.user) {
      post.setUserVote(res.locals.user);
    }

    await comment.save();
    return res.json(comment);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "빵을 찾을 수 없습니다." });
  }
};

const getPostsSearch = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const perPage: number = (req.query.count || 8) as number;
  const { value } = req.query;
  // 제목 또는 내용에 대한 검색:
  try {
    const posts = await Post.find({
      where: [{ title: Like(`%${value}%`) }, { body: Like(`%${value}%`) }],
      order: { createdAt: "DESC" },
      relations: ["sub", "votes", "comments"],
      skip: currentPage * perPage,
      take: perPage,
    });

    if (res.locals.user) {
      posts.forEach((p) => p.setUserVote(res.locals.user));
    }

    return res.json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

const deletePost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  const user: User = res.locals.user;
  try {
    const post = await Post.findOneOrFail({ where: { identifier, slug } });
    const sub = await Sub.findOneOrFail({ where: { name: post.subName } });
    // 오븐 관리자 또는 빵 작성자면 빵을 삭제할 수 있다.
    if (sub.username === user.username || post.username === user.username) {
      await AppDataSource.createQueryBuilder()
        .softDelete()
        .from(Post)
        .where("identifier = :identifier", { identifier })
        .execute();
      return res.status(204).end();
    } else {
      return res.status(403).json({ error: "권한이 없습니다." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

const postRouter = Router();

postRouter.get("/:identifier/:slug", userMiddleware, getPost);
postRouter.post("/", userMiddleware, authMiddleware, createPost);
postRouter.get("/", userMiddleware, getPosts);
postRouter.get("/:identifier/:slug/comments", userMiddleware, getPostComments);
postRouter.post(
  "/:identifier/:slug/comments",
  userMiddleware,
  authMiddleware,
  createPostComment
);
postRouter.get("/search", userMiddleware, getPostsSearch);
postRouter.delete(
  "/:identifier/:slug",
  userMiddleware,
  authMiddleware,
  deletePost
);

export default postRouter;
