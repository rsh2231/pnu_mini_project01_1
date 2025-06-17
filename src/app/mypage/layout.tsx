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
    <div className="flex min-h-screen bg-gray-50 max-w-[1024px] mx-auto">
      <aside className="w-52 bg-white border-r shadow-md px-4 py-8 space-y-6">
        <h2 className="text-xl font-bold text-teal-600">마이페이지</h2>
        <nav className="flex flex-col gap-4 text-gray-700">
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
            href="/mypage/bookmark"
            current={pathname === "/mypage/bookmark"}
          >
            북마크
          </MypageLink>
          <MypageLink
            href="/mypage/settings"
            current={pathname === "/mypage/settings"}
          >
            설정
          </MypageLink>
        </nav>
      </aside>

      {/* 본문 영역 */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

// 선택된 항목에 강조 스타일 주는 사이드바 링크
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
      className={`px-2 py-2 rounded-md transition-all ${
        current
          ? "bg-teal-100 text-teal-700 font-semibold"
          : "hover:bg-gray-100 text-gray-700"
      }`}
    >
      {children}
    </Link>
  );
}
