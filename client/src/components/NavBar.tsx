import { useAuthDispatch, useAuthState } from "@/context/auth";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaSearch } from "react-icons/fa";

// 로그인, 회원가입 페이지에는 없다!
// NavBar UI 만들기
const NavBar: React.FC = () => {
  const { loading, authenticated } = useAuthState();
  const dispatch = useAuthDispatch();
  const handleLogOut = () => {
    axios
      .post("/auth/logout")
      .then(() => {
        // context에 들어있는 유저 정보 업데이트(null)
        dispatch("LOGOUT");
        // page refresh
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-14 px-5 bg-white">
      <span className="text-2xl font-semibold text-gray-400">
        <Link href="/">
          <Image src="/pang-yo.png" alt="logo" width={60} height={45}></Image>
        </Link>
      </span>
      <div className="max-w-full px-4">
        <div className="relative flex items-center bg-gray-100 border rounded hover:border-gray-700 hover:bg-white">
          <FaSearch className="ml-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Pangyo"
            className="px-3 py-1 bg-transparent rounded h-7 focus:outline-none"
          />
        </div>
      </div>
      <div className="flex">
        {!loading &&
          (authenticated ? (
            <button
              className="w-20 px-2 mr-2 text-sm text-center text-white bg-gray-400 rounded h-7"
              onClick={handleLogOut}
            >
              로그아웃
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="w-20 px-2 pt-1 mr-2 text-sm text-center text-blue-500 border border-blue-500 rounded h-7"
              >
                로그인
              </Link>
              <Link
                href="/register"
                className="w-20 px-2 pt-1 text-sm text-center text-white bg-gray-400 rounded h-7"
              >
                회원가입
              </Link>
            </>
          ))}
      </div>
    </div>
  );
};

export default NavBar;
