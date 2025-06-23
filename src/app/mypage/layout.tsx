"use client";

import Link from "next/link";
import { useAtom } from "jotai";
import { isLoginAtom } from "@/atoms/IsLoginAtom";
import LoginModal from "@/components/UI/Login/LoginModal";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loginState] = useAtom(isLoginAtom);
  const pathname = usePathname();

  if (!loginState || !loginState.isLogin) {
    // 로그인 상태 확인 전에는 렌더링하지 않음 (로딩 상태)
    return null;
  }

  if (loginState.isLogin !== "logged-in") {
    return <LoginModal onclose={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#1e3a8a] text-white font-sans">
      <div className="max-w-screen-xl mx-auto flex flex-col md:grid md:grid-cols-[200px_1fr] min-h-screen">
        {/* 사이드바 */}
        <aside className="bg-[#0f172a]/70 border-b md:border-b-0 md:border-r border-blue-900 px-4 py-4 md:py-10 backdrop-blur-md">
          <Link
            href="/mypage"
            className="text-lg sm:text-xl font-bold text-cyan-300 mb-4 md:mb-6 hover:underline cursor-pointer"
          >
            마이페이지
          </Link>
          <nav className="flex overflow-x-auto md:flex-col gap-2 md:gap-4 text-sm sm:text-base whitespace-nowrap">
            <MypageLink
              href="/mypage/profile"
              current={pathname === "/mypage/profile"}
            >
              내 정보
            </MypageLink>
            <MypageLink
              href="/mypage/history"
              current={pathname === "/mypage/history"}
            >
              신청 내역
            </MypageLink>
            <MypageLink
              href="/mypage/posts"
              current={pathname === "/mypage/posts"}
            >
              나눔 게시글
            </MypageLink>
          </nav>
        </aside>

        {/* 본문 */}
        <main className="p-4 sm:p-6 md:p-8 bg-[#1e293b]/60 backdrop-blur-lg w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

// 사이드바 링크 컴포넌트
function MypageLink({
  href,
  children,
  current,
}: {
  href: string;
  children: React.ReactNode;
  current?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-lg transition-all font-medium ${
        current
          ? "bg-cyan-300/20 text-white"
          : "hover:bg-white/10 text-gray-300"
      }`}
    >
      {children}
    </Link>
  );
}
