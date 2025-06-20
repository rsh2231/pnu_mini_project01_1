"use client";

import { useFetchUser } from "@/hooks/useFetchUser";
import { useEffect, useState } from "react";
import axios from "axios";

const formatDateTime = (datetime: string) =>
  new Date(datetime).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function HistoryPage() {
  const { user, loading: userLoading } = useFetchUser();
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [items, setItems] = useState<OrderItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const springurl = process.env.NEXT_PUBLIC_SPRING_API;
  const token = typeof window !== "undefined" ? sessionStorage.getItem("jwtToken") : "";

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user || !token) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        const orderRes = await axios.get(`${springurl}/api/order/read`, {
          headers: {
            Authorization: token,
          },
          withCredentials: true,
        });

        const orderData = orderRes.data?.content?.order;
        if (!orderData) {
          setError("신청 내역이 없습니다.");
          setLoading(false);
          return;
        }

        setOrder(orderData);

        const itemRes = await axios.get(`${springurl}/api/order/detail`, {
          params: { orderId: orderData.orderId },
          headers: {
            Authorization: token,
          },
          withCredentials: true,
        });

        setItems(itemRes.data?.content?.orderItems || []);
      } catch (err: any) {
        console.error(err);
        setError("신청 내역을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [user, token]);

  if (userLoading || loading)
    return <p className="text-center text-gray-600 mt-20 text-lg font-medium">불러오는 중...</p>;

  if (error)
    return <p className="text-center text-red-500 mt-20 text-lg font-semibold">{error}</p>;

  if (!order)
    return <p className="text-center text-gray-500 mt-20 text-lg font-medium">신청 내역이 없습니다.</p>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-800">📦 신청 내역</h1>

      <div className="bg-white p-5 rounded-lg shadow-md border space-y-3">
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">신청자:</span>
          <span>{order.username}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">신청일:</span>
          <span>{formatDateTime(order.createdAt)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">총 금액:</span>
          <span className="text-blue-700 font-semibold">
            {order.totalPrice.toLocaleString()}원
          </span>
        </div>
        {order.filePath && (
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">첨부파일:</span>
            <a
              href={order.filePath}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline break-all"
            >
              파일 열기
            </a>
          </div>
        )}
      </div>

      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">📝 품목 목록</h2>
        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item, i) => (
            <li
              key={i}
              className="bg-gray-50 border rounded-lg p-4 shadow-sm hover:shadow transition"
            >
              <p className="font-medium text-gray-800">{item.itemName}</p>
              <p className="text-sm text-gray-500 mt-1">
                {item.itemPrice.toLocaleString()}원
              </p>
            </li>
          ))}
          {items.length === 0 && (
            <p className="text-center text-gray-500 col-span-full mt-4">
              등록된 품목이 없습니다.
            </p>
          )}
        </ul>
      </section>
    </div>
  );
}
