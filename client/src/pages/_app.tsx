import "../app/globals.css";
import type { AppProps } from "next/app";
import axios from "axios";
import { AuthProvider } from "@/context/auth";
import { useRouter } from "next/router";
import NavBar from "@/components/NavBar";
import { SWRConfig } from "swr";
import Head from "next/head";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api`;
  axios.defaults.withCredentials = true;

  // 회원가입, 로그인 페이지에서는 navbar를 보여주지 않는다.
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);

  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };
  // 회원가입, 로그인 페이지 외에는 패딩 탑 16를 부여
  return (
    <>
      <Head>
        {/* 상위 페이지에 아래와 같이 설정해주면 아이콘이 적용됨 v6는 유료화됨 */}
        <Script
          defer
          src="https://use.fontawesome.com/releases/v5.15.4/js/all.js"
          integrity="sha384-rOA1PnstxnOBLzCLMcre8ybwbTmemjzdNlILg8O7z1lUkLXozs4DHonlDtnE7fpc"
          crossOrigin="anonymous"
        ></Script>
      </Head>
      <SWRConfig
        value={{
          fetcher,
        }}
      >
        <AuthProvider>
          {!authRoute && <NavBar />}
          <div className={authRoute ? "" : "pt-12 bg-gray-200 min-h-screen"}>
            <Component {...pageProps} />
          </div>
        </AuthProvider>
      </SWRConfig>
    </>
  );
}

export default MyApp;
