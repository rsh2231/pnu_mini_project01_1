"use client";

import { useAtom } from "jotai";
import { isLoginAtom } from "@/atoms/IsLoginAtom";

export default function MyPageHome() {
  const [loginState] = useAtom(isLoginAtom);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-teal-700">안녕하세요, {loginState.username || "사용자"}님 👋</h1>
      <p className="text-gray-600">최근 활동 요약입니다.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        <SummaryCard title="총 신청 내역" value="12건" />
        <SummaryCard title="진행 중" value="3건" />
      </div>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-5 bg-white rounded-lg border shadow hover:shadow-md transition">
      <h2 className="text-gray-600 font-medium">{title}</h2>
      <p className="text-2xl text-teal-600 font-bold mt-2">{value}</p>
    </div>
  );
}
