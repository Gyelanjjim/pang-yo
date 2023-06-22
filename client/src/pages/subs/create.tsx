import InputGroup from "@/components/InputGroup";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";

const SubCreate = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<any>({});
  let router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const res = await axios.post("/subs", { name, title, description });

      router.push(`/p/${res.data.name}`);
    } catch (error: any) {
      console.log(error);
      setErrors(error.response.data);
    }
  };
  // 커뮤니티 만들기 UI 생성
  return (
    <div className="flex flex-col justify-center pt-16">
      <div className="w-10/12 p-4 mx-auto bg-white rounded md:w-96">
        <h1 className="mb-2 text-lg font-medium">오븐 만들기</h1>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="my-6">
            <p className="font-medium">Name</p>
            <p className="mb-2 text-xs text-gray-400">
              오븐 이름은 변경할 수 없습니다.
            </p>
            <InputGroup
              placeholder="이름"
              value={name}
              setValue={setName}
              error={errors.name}
            />
          </div>
          <div className="my-6">
            <p className="font-medium">Title</p>
            <p className="mb-2 text-xs text-gray-400">
              주제를 나타냅니다. 언제든지 변경할 수 있습니다.
            </p>
            <InputGroup
              placeholder="제목"
              value={title}
              setValue={setTitle}
              error={errors.title}
            />
          </div>
          <div className="my-6">
            <p className="font-medium">Description</p>
            <p className="mb-2 text-xs text-gray-400">
              해당 오븐에 대한 설명입니다.
            </p>
            <InputGroup
              placeholder="설명"
              value={description}
              setValue={setDescription}
              error={errors.description}
            />
          </div>
          <div className="flex justify-end">
            <button className="px-4 py-1 text-sm font-semibold text-white bg-gray-400 border rounded">
              오븐 만들기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubCreate;

// 로그인 안한사람이 커뮤니티 생성페이지 접근할 경우 처리
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    // 쿠키가 없으면 에러를 보낸다
    if (!cookie) throw new Error("Missing auth token cookie");
    // 쿠키가 있다면 백엔드에서 인증처리
    await axios.get(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/me`, {
      headers: { cookie },
    });

    return { props: {} };
  } catch (error) {
    // 요청의 쿠키를 이용해 백엔드에서 인증 처리 시 에러가 나면 로그인 페이지로 이동
    res.writeHead(307, { Location: "/login" }).end();
    return { props: {} };
  }
};
