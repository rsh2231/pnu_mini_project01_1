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
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderDetail, setOrderDetail] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const springurl = process.env.NEXT_PUBLIC_SPRING_API || "";
  const token = typeof window !== "undefined" ? sessionStorage.getItem("jwtToken") : "";

  useEffect(() => {
    if (!user || !token) return;

    setLoading(true);
    setError(null);

    axios
      .get(`${springurl}/api/order/reads`, {
        headers: { Authorization: token },
        withCredentials: true,
      })
      .then((res) => {
        const orderList: OrderDto[] = res.data?.content?.orders || [];
        setOrders(orderList);
        if (orderList.length > 0) {
          setSelectedOrderId(String(orderList[0].orderId));
        }
      })
      .catch(() => setError("신청 내역을 불러오는 데 실패했습니다."))
      .finally(() => setLoading(false));
  }, [user, token]);

  useEffect(() => {
    if (!selectedOrderId || !token) {
      setOrderDetail(null);
      return;
    }

    setLoading(true);
    setError(null);

    axios
      .get(`${springurl}/api/order/detail`, {
        params: { orderId: selectedOrderId },
        headers: { Authorization: token },
        withCredentials: true,
      })
      .then((res) => {
        const detail: OrderResponse = res.data?.content || null;
        setOrderDetail(detail);
      })
      .catch(() => {
        setOrderDetail(null);
        setError("상세 내역을 불러오는 데 실패했습니다.");
      })
      .finally(() => setLoading(false));
  }, [selectedOrderId, token]);

  if (userLoading || loading)
    return <p className="text-center text-gray-600 mt-20 text-lg">불러오는 중...</p>;

  if (error)
    return <p className="text-center text-red-500 mt-20 text-lg">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">📦 신청 내역</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-3">
          {orders.length === 0 && (
            <p className="text-center text-gray-500">신청 내역이 없습니다.</p>
          )}
          {orders.map((order) => (
            <button
              key={order.orderId}
              className={`w-full text-left border p-3 rounded-md ${
                selectedOrderId === String(order.orderId)
                  ? "bg-blue-50 border-blue-400"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => setSelectedOrderId(String(order.orderId))}
            >
              <p className="font-medium text-gray-800">{order.username}</p>
              <p className="text-sm text-gray-500">{formatDateTime(order.createdAt)}</p>
              <p className="text-sm text-gray-700">{order.totalPrice.toLocaleString()}원</p>
            </button>
          ))}
        </div>

        <div className="md:col-span-2 bg-white border p-5 rounded-lg space-y-4 shadow">
          {orderDetail ? (
            <>
              <div className="space-y-1">
                <p><span className="font-medium">신청자:</span> {orderDetail.order.username}</p>
                <p><span className="font-medium">신청일:</span> {formatDateTime(orderDetail.order.createdAt)}</p>
                <p><span className="font-medium">총 금액:</span> {orderDetail.order.totalPrice.toLocaleString()}원</p>
              </div>

              {orderDetail.filePath && (
                <div>
                  <p className="font-medium text-gray-700 mb-1">첨부 이미지:</p>
                  <img src={orderDetail.filePath} alt="첨부파일" className="max-w-full h-auto border rounded shadow" />
                </div>
              )}

              <div>
                <p className="font-semibold text-gray-800 mb-2">📝 품목 목록</p>
                {orderDetail.orderItems.length > 0 ? (
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {orderDetail.orderItems.map((item, i) => (
                      <li key={i} className="p-3 border rounded-md bg-gray-50">
                        <p className="font-medium">{item.itemName}</p>
                        <p className="text-sm text-gray-600">{item.itemPrice.toLocaleString()}원</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">등록된 품목이 없습니다.</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">주문을 선택해주세요.</p>
          )}
        </div>
      </div>
    </div>
  );
}