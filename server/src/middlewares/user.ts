import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
// 유저 정보를 필요로 할 때
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 쿠키에 담긴 토큰 가져오기
    const token = req.cookies.token;
    if (!token) return next();
    // 토큰 decode하기
    const { username }: any = jwt.verify(token, `${process.env.JWT_SECRET}`);
    // 토큰에서 나온 username으로 유저 정보 찾기
    const user = await User.findOneBy({ username });

    if (!user) throw new Error("Unauthenticated");

    // 유저 정보를 res.local.user에 넣어주기
    res.locals.user = user;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Something went wrong" });
  }
};
