"use client";

import { useFetchUser } from "@/hooks/useFetchUser";

export default function ProfilePage() {
  const { user, loading } = useFetchUser();

  if (loading) return <p>로딩중... ⏳</p>;
  if (!user) return <p>로그인후 이용 가능합니다.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl text-gray-700 font-bold">내 정보</h1>
      <div className="bg-white text-gray-700 rounded shadow p-6 space-y-4">
        <p>
          <strong>이름:</strong> {user.username}
        </p>
        <p>
          <strong>닉네임:</strong> {user.nickname}
        </p>
        <p>
          <strong>주소:</strong> {user.address}
        </p>
        <button className="mt-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600">
          정보 수정
        </button>
      </div>
    </div>
  );
}
