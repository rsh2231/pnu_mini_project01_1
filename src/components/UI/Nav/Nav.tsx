"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Button01 from "@/components/etc/Button01";
import LoginModal from "../Login/LoginModal";
import { useAtom } from "jotai";
import { Logininfo } from "@/type/logininfo";
import { isLoginAtom } from "@/atoms/IsLoginAtom";
import axios from "axios";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

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
          console.log("로그인 유저정보", res.data);
          setloginstate({
            isLogin: "logged-in",
            username: res.data.username,
          });
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
              nickname: "",
              logintype: "",
              role: undefined,
              username: "",
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
      isLogin: "logged-out",
      nickname: "",
      logintype: "",
      role: undefined,
      username: "",
    });
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="bg-[#0f172a]/90 backdrop-blur-md text-white shadow-sm border-b border-blue-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* 로고 */}
          <div className="text-xl font-bold tracking-tight text-cyan-300 hover:text-cyan-400 transition hover:animate-fade">
            <Link href="/">Sortify</Link>
          </div>

          {/* 데스크탑 메뉴 */}
          <div className="hidden sm:flex items-center gap-6">
            <nav className="flex gap-6 items-center text-md font-medium">
              <NavLink href="/waste-fees">대형폐기물</NavLink>
              {loginstate.isLogin === "logged-in" ? (
                <NavLink href="/dashboard">나눔게시판</NavLink>
              ) : (
                <button
                  onClick={() => toast.info("로그인 후 이용 가능합니다.")}
                  className="text-white/70 cursor-not-allowed"
                >
                  나눔게시판
                </button>
              )}
            </nav>
            <div className="flex gap-3 items-center">
              {loginstate.isLogin === "logged-in" && (
                <Link href="/mypage">
                  <Button01 caption="마이페이지" bg_color="cyan" />
                </Link>
              )}
              {loginstate.isLogin === "logged-in" ? (
                <Button01
                  caption="로그아웃"
                  bg_color="orange"
                  onClick={handleLogout}
                />
              ) : (
                <Button01
                  caption="로그인"
                  bg_color="blue"
                  onClick={() => setOpen(true)}
                />
              )}
            </div>
          </div>

          {/* 모바일 햄버거 버튼 */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 메뉴 오버레이 */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 sm:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* 모바일 메뉴 */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#1e293b] shadow-lg z-50 transform transition-transform duration-300 ease-in-out sm:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col items-end">
          <button onClick={closeMobileMenu} className="text-white mb-6">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <nav className="flex flex-col gap-4 items-end text-lg w-full">
            <NavLink href="/waste-fees" onClick={closeMobileMenu}>대형폐기물</NavLink>
            {loginstate.isLogin === "logged-in" ? (
              <NavLink href="/dashboard" onClick={closeMobileMenu}>나눔게시판</NavLink>
            ) : (
              <button
                onClick={() => {
                  toast.info("로그인 후 이용 가능합니다.");
                  closeMobileMenu();
                }}
                className="text-white/70 cursor-not-allowed"
              >
                나눔게시판
              </button>
            )}
          </nav>
          <div className="flex flex-col items-end gap-4 mt-6 w-full">
            {loginstate.isLogin === "logged-in" && (
              <Link href="/mypage" onClick={closeMobileMenu}>
                <Button01 caption="마이페이지" bg_color="cyan" />
              </Link>
            )}
            {loginstate.isLogin === "logged-in" ? (
              <Button01
                caption="로그아웃"
                bg_color="orange"
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
              />
            ) : (
              <Button01
                caption="로그인"
                bg_color="blue"
                onClick={() => {
                  setOpen(true);
                  closeMobileMenu();
                }}
              />
            )}
          </div>
        </div>
      </div>

      {open && <LoginModal onclose={() => setOpen(false)} />}
    </>
  );
}

// 공통 네비게이션 링크 스타일 컴포넌트
function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="relative text-white hover:text-cyan-300 transition duration-300 group"
    >
      {children}
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
    </Link>
  );
}
