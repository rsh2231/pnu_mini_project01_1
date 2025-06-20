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
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);
  const [items, setItems] = useState<OrderItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const springurl = process.env.NEXT_PUBLIC_SPRING_API;
  const token = typeof window !== "undefined" ? sessionStorage.getItem("jwtToken") : "";

  // 신청 목록 전체 조회
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !token) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${springurl}/api/order/list`, {
          headers: { Authorization: token },
          withCredentials: true,
        });
        const orderList = res.data?.content?.orders || [];
        setOrders(orderList);
        if (orderList.length > 0) {
          setSelectedOrder(orderList[0]);
        }
      } catch (err) {
        console.error(err);
        setError("신청 내역을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token]);

  // 선택된 주문의 상세 품목 불러오기
  useEffect(() => {
    const fetchItems = async () => {
      if (!selectedOrder || !token) return;

      try {
        const res = await axios.get(`${springurl}/api/order/detail`, {
          params: { orderId: selectedOrder.orderId },
          headers: { Authorization: token },
          withCredentials: true,
        });
        setItems(res.data?.content?.orderItems || []);
      } catch (err) {
        console.error(err);
        setItems([]);
      }
    };

    fetchItems();
  }, [selectedOrder, token]);

  if (userLoading || loading)
    return <p className="text-center text-gray-600 mt-20 text-lg">불러오는 중...</p>;

  if (error)
    return <p className="text-center text-red-500 mt-20 text-lg">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">📦 신청 내역</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {/* 신청 목록 리스트 */}
        <div className="space-y-3">
          {orders.map((order) => (
            <button
              key={order.orderId}
              className={`w-full text-left border p-3 rounded-md ${
                selectedOrder?.orderId === order.orderId
                  ? "bg-blue-50 border-blue-400"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => setSelectedOrder(order)}
            >
              <p className="font-medium text-gray-800">{order.username}</p>
              <p className="text-sm text-gray-500">{formatDateTime(order.createdAt)}</p>
              <p className="text-sm text-gray-700">{order.totalPrice.toLocaleString()}원</p>
            </button>
          ))}
        </div>

        {/* 상세 보기 */}
        {selectedOrder && (
          <div className="md:col-span-2 bg-white border p-5 rounded-lg space-y-4 shadow">
            <div className="space-y-1">
              <p><span className="font-medium text-gray-700">신청자:</span> {selectedOrder.username}</p>
              <p><span className="font-medium text-gray-700">신청일:</span> {formatDateTime(selectedOrder.createdAt)}</p>
              <p><span className="font-medium text-gray-700">총 금액:</span> {selectedOrder.totalPrice.toLocaleString()}원</p>
            </div>

            {/* 첨부 이미지 렌더링 */}
            {selectedOrder.filePath && (
              <div>
                <p className="font-medium text-gray-700 mb-1">첨부 이미지:</p>
                <img
                  src={selectedOrder.filePath}
                  alt="첨부파일 이미지"
                  className="max-w-full h-auto border rounded shadow"
                />
              </div>
            )}

            {/* 품목 목록 */}
            <div>
              <p className="font-semibold text-gray-800 mb-2">📝 품목 목록</p>
              {items.length > 0 ? (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {items.map((item, i) => (
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
          </div>
        )}
      </div>
    </div>
  );
}
