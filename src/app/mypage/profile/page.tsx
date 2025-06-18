// app/mypage/profile/page.tsx
"use client";

export default function ProfilePage() {
  const user = {
    name: "홍길동",
    email: "honggildong@example.com",
    phone: "010-1234-5678",
    address: "서울특별시 성북구 정릉로 123",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">내 정보</h1>
      <div className="bg-white text-gray-700 rounded shadow p-6 space-y-4">
        <p>
          <strong>이름:</strong> {user.name}
        </p>
        <p>
          <strong>이메일:</strong> {user.email}
        </p>
        <p>
          <strong>전화번호:</strong> {user.phone}
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
