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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (loginState.isLogin !== "logged-in") {
      setShowLoginModal(true);
    }
  }, [loginState]);

  if (showLoginModal) {
    return <LoginModal onclose={() => setShowLoginModal(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#1e3a8a] text-white font-sans">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-[200px_1fr] min-h-screen">
        {/* 사이드바 */}
        <aside className="bg-[#0f172a]/70 border-r border-blue-900 p-4 md:py-10 backdrop-blur-md">
          <h2 className="text-lg md:text-xl font-bold text-cyan-300 mb-6">
            마이페이지
          </h2>
          <nav className="flex md:flex-col gap-2 md:gap-4 text-sm md:text-base">
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
        <main className="p-4 md:p-8 bg-[#1e293b]/60 backdrop-blur-lg">
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
