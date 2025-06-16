"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Button01 from "@/components/etc/Button01";
import LoginModal from "../Login/LoginModal";
import { useAtom } from "jotai";
import { Logininfo } from "@/type/logininfo";
import { isLoginAtom } from "@/atoms/IsLoginAtom";
import axios from "axios";
import { redirect, usePathname, useRouter } from "next/navigation";

export default function Nav() {
  // 로그인모달창 처리
  const [open, setOpen] = useState(false);
  // 모델선택모달창 처리
  const [chooseModel, setchooseModel] = useState(false);
  //로그인 상태 관리
  const [loginstate, setloginstate] = useAtom<Logininfo>(isLoginAtom);
  //로그인 정보 불러오기 & 에러 메세지 처리

  useEffect(() => {
    //Oauth유저 로그인시 쿠키확인용
    const checkOauthUser = async () => {

      const sessionToken = sessionStorage.getItem("jwtToken")?.trim() || "";

      try {
        const res = await axios.get("/api/login/oauth2", {
          withCredentials: true,
        });
        return res.data; // 응답 데이터를 반환 쿠키헤더에서 토큰 읽어서 세션에 저장 할지 물어볼것
      } catch (error) {
        console.error("OAuth2 사용자 정보 가져오기 실패:", error);
        return null; // 오류 발생 시 null 반환
      }
    };

    //로그인 정보 불러오기
    const getUserInfo = async () => {
      const sessionToken = sessionStorage.getItem("jwtToken")?.trim() || ""; // DB유저 확인 Session 토큰 확인
      const oauth2user = await checkOauthUser(); // Oauth2유저 확인 True False
      //토큰 이나 쿠키가 있으면 로그인 유저 확인
      if (oauth2user.isOAuthLoggedIn || sessionToken.length > 0) {
        try {
          const res = await axios.get("/api/login/userinfo", {
            headers: { Authorization: sessionToken },
            withCredentials: true,
          });
          console.log(res.data)
          setloginstate({ isLogin: 'logged-in' });

        } catch (error: any) {
          console.error(
            "유저 불러오기 실패 Nav : ",
            error.response?.data?.error
          );
          const errmsg = error.response?.data?.error.message;
          const keyword = "The Token has expired on";
          if (errmsg && JSON.stringify(errmsg).includes(keyword)) {
            console.log("getUserInfo - 토큰만료");
            sessionStorage.removeItem("jwtToken");
            setloginstate({
              isLogin: "logged-out",
              nickname: '',
              logintype: '',
              role: undefined,
              username: '',
            });
          }
        }
      }
    };
    //다른페이지에서 왔을때 에러 확인후 출력용
    const params = new URLSearchParams(window.location.search);
    const errorMessage = params.get("error");

    if (errorMessage) {
      alert("결과를 로딩할 수 없음: 서버 문제 확인 필요");
      redirect("/");
    }
    getUserInfo();
  }, [loginstate.isLogin]);

  //로그아웃 api요청 로그아웃에서 세션 토큰 삭제 방식으로 바꿈
  const handleLogout = async () => {
    sessionStorage.removeItem("jwtToken");
    setloginstate({
      isLogin: 'logged-out',
      nickname: "",
      logintype: "",
      role: undefined,
      username: "",
    });
  };

 return (
    <>
      <header className="bg-white/70 backdrop-blur-md text-teal-900 shadow-sm border-b border-teal-200 sticky top-0 z-50 overflow-visible">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* 왼쪽 로고 영역 */}
          <div className="text-xl font-bold tracking-tight text-teal-800">
            <Link href="/">WasteSort</Link>
          </div>

          {/* 가운데 네비게이션 */}
          <nav className="flex gap-6 items-center text-md font-medium">
            <NavLink href="/">홈</NavLink>
            <NavLink href="/large-waste">대형폐기물</NavLink>
            <NavLink href="/dashboard">나눔게시판</NavLink>
          </nav>

          {/* 오른쪽 버튼 */}
          <div className="flex items-center gap-3">
            {loginstate.isLogin === "logged-in" ? (
              <Button01 caption="로그아웃" bg_color="orange" onClick={handleLogout} />
            ) : (
              <Button01 caption="로그인" bg_color="blue" onClick={() => setOpen(true)} />
            )}
          </div>
        </div>
      </header>

      {/* 모달은 헤더 밖 최상위에 렌더링 */}
      {open && <LoginModal onclose={() => setOpen(false)} />}
    </>
  );
}

// 공통 네비게이션 링크 스타일 컴포넌트
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative text-teal-700 hover:text-teal-500 transition duration-300 group"
    >
      {children}
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-teal-400 group-hover:w-full transition-all duration-300"></span>
    </Link>
  );
}
