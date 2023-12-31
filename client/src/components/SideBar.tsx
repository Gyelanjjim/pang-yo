import { useAuthState } from "@/context/auth";
import Link from "next/link";
import React from "react";
import dayjs from "dayjs";
import { Sub } from "@/types";
type Props = { sub: Sub };

const SideBar = ({ sub }: Props) => {
  const { authenticated } = useAuthState();
  return (
    <div className="hidden w-4/12 ml-3 md:block">
      <div className="bg-white border rounded">
        <div className="p-3 bg-gray-400 rounded-t">
          <p className="font-semibold text-white">우리 오븐을 소개합니다!</p>
        </div>
        <div className="p-3">
          <p className="mb-3 text-base">{sub?.description}</p>
          <div className="flex mb-3 text-sm font-medium">
            <div className="w-1/2">
              오븐관리자
              <Link
                href={`/u/${sub.username}`}
                className="mx-1 hover:underline"
              >
                /u/{sub.username}
              </Link>
            </div>
          </div>
          <div className="flex mb-3 text-sm font-medium">
            <div className="w-1/2">
              <p>제빵수험생 {sub.user?.count}명</p>
            </div>
          </div>
          <p className="my-3">
            오븐시작일: {dayjs(sub?.createdAt).format("MM.DD.YYYY")}
          </p>

          {authenticated && (
            <div className="mx-0 my-2">
              <Link
                href={`/p/${sub.name}/create`}
                className="w-full p-2 text-sm text-white bg-gray-400 rounded"
              >
                빵 만들기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
