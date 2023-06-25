import axios from "axios";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FaArrowDown, FaArrowUp, FaCommentAlt } from "react-icons/fa";
import { useAuthState } from "../context/auth";
import { Post } from "../types";

interface PostCardProps {
  post: Post;
  subMutate?: () => void; // 리턴값이 없는 함수타입이므로
  mutate?: () => void;
}

const PostCard = ({
  post: {
    identifier,
    slug,
    title,
    body,
    subName,
    createdAt,
    voteScore,
    userVote,
    commentCount,
    url,
    username,
    sub,
  },
  mutate,
  subMutate,
}: PostCardProps) => {
  const router = useRouter();
  const isInSubPage = router.pathname === "/p/[sub]";

  const { authenticated } = useAuthState();

  const vote = async (value: number) => {
    if (!authenticated) router.push("/login");

    if (value === userVote) value = 0;

    try {
      await axios.post("/votes", { identifier, slug, value });
      if (mutate) mutate();
      if (subMutate) subMutate(); // props로 들어왔을 때만 호출하도록
    } catch (error) {
      console.log(error);
    }
  };
  const backgroundColor = (value: number | undefined) => {
    if (typeof value === "number")
      if (value >= 5) {
        return "rgb(253 230 138)";
      } else if (value >= 3) {
        return "rgb(254 243 199)";
      } else if (value > 0) {
        return "rgb(255 251 235)";
      } else if (value === 0) {
        return "white";
      } else if (value > -3) {
        return "rgb(120 113 108)";
      } else if (value > -4) {
        return "rgb(68 64 60)";
      } else if (value > -5) {
        return "rgb(28 25 23)";
      } else {
        return "rgb(12 10 9)";
      }
  };

  return (
    <div
      className="flex mb-4 rounded"
      id={identifier}
      style={{ backgroundColor: backgroundColor(voteScore) }}
    >
      {/* 좋아요 싫어요 기능 부분 */}
      <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
        {/* 좋아요 */}
        <div
          className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
          onClick={() => vote(1)}
        >
          {userVote === 1 ? (
            <FaArrowUp className="text-red-500" />
          ) : (
            <FaArrowUp />
          )}
        </div>
        <p className="text-xs font-bold">{voteScore}</p>
        {/* 싫어요 */}
        <div
          className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
          onClick={() => vote(-1)}
        >
          {userVote === -1 ? (
            <FaArrowDown className="text-blue-500" />
          ) : (
            <FaArrowDown />
          )}
        </div>
      </div>
      {/* 포스트 데이터 부분 */}
      <div className="w-full p-2">
        <div className="flex items-center">
          {!isInSubPage && (
            <div className="flex items-center">
              <Link href={`/p/${subName}`}>
                <Image
                  src={sub!.imageUrl}
                  alt="sub"
                  className="rounded-full cursor-pointer"
                  width={12}
                  height={12}
                />
              </Link>
              <Link
                href={`/p/${subName}`}
                className="ml-2 text-xs font-bold cursor-pointer hover:underline"
              >
                /p/{subName}
              </Link>
              <span className="mx-1 text-xs text-gray-400">•</span>
            </div>
          )}

          <p className="text-xs text-gray-400">
            <Link href={`/u/${username}`} className="mx-1 hover:underline">
              /u/{username}
            </Link>
            수험생님이 만든 빵 • 제조일자:
            <Link href={url} className="mx-1 hover:underline">
              {dayjs(createdAt).format("YYYY-MM-DD HH:mm")}
            </Link>
          </p>
        </div>

        <Link href={url} className="my-1 text-lg font-medium">
          {title}
        </Link>
        {body && <p className="my-1 text-sm">{body}</p>}
        <div className="flex">
          <FaCommentAlt className="mr-1 mt-1 text-sm" />
          <Link href={url}>
            <span>{commentCount}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
