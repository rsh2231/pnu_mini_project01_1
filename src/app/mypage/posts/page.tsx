"use client";

import { useFetchUser } from "@/hooks/useFetchUser";
import BoardList from "@/components/board/BoardList";

export default function MyPosts() {
  const { user, loading } = useFetchUser();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-300 font-bold">로딩중... ⏳</p>
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-300 font-bold">
          로그인 후 이용 가능합니다.
        </p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 text-white">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 border-b border-blue-900 pb-3">
        📝 내가 작성한 글
      </h1>
      <BoardList fixedWriter={user.nickname} />
    </div>
  );
}
