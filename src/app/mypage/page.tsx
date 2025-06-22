"use client";

import { useEffect, useState } from "react";
import { useFetchUser } from "@/hooks/useFetchUser";
import axios from "axios";

export default function MyPageHome() {
  const { user, loading } = useFetchUser();
  const [postCount, setPostCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [orderError, setOrderError] = useState<string>("");

  const springurl = process.env.NEXT_PUBLIC_SPRING_API;

  useEffect(() => {
    if (user?.nickname) {
      axios
        .get(`${springurl}/api/posts`, {
          params: {
            writer: user.nickname,
            page: 1,
            size: 1,
            method: "latest",
            q: "",
          },
        })
        .then((res) => {
          const total = res.data?.content?.dashResponseDto?.totalElements;
          if (typeof total === "number") {
            setPostCount(total);
          } else {
            setError("게시글 수를 불러올 수 없습니다.");
          }
        })
        .catch(() => {
          setError("게시글 수를 불러오는데 실패했습니다.");
        });

      axios.get(`${springurl}/api/order/reads`)
        .then((res) => {
          const orders = res.data?.content?.orders;
          if (Array.isArray(orders)) {
            setOrderCount(orders.length);
          } else {
            setOrderError("신청 내역을 불러올 수 없습니다.");
          }
        })
        .catch(() => {
          setOrderError("신청 내역을 불러오는데 실패했습니다.");
        });
    }
  }, [user]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-300 font-bold">로딩중... ⏳</p>
      </div>
    );

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-cyan-300">
        안녕하세요, {user?.nickname || "사용자"}님 👋
      </h1>
      <p className="text-sm sm:text-base text-gray-300">
        최근 활동 요약입니다.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6">
        <SummaryCard
          title="총 신청 내역"
          value={
            orderError
              ? "불러오기 실패"
              : orderCount !== null
              ? `${orderCount}건`
              : "로딩중... ⌛"
          }
        />
        <SummaryCard
          title="게시글 수"
          value={
            error
              ? "불러오기 실패"
              : postCount !== null
              ? `${postCount}건`
              : "로딩중... ⌛"
          }
        />
      </div>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-4 sm:p-5 rounded-xl border border-blue-900 bg-[#1e293b]/70 backdrop-blur-md shadow hover:shadow-lg transition duration-300">
      <h2 className="text-gray-400 text-sm sm:text-base font-medium">
        {title}
      </h2>
      <p className="text-xl sm:text-2xl font-bold text-cyan-300 mt-2">
        {value}
      </p>
    </div>
  );
}
