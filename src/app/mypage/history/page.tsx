"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useFetchUser } from "@/hooks/useFetchUser";

export default function MyOrderHistoryPage() {
  const { user, loading } = useFetchUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<Record<string, any>>({});
  const springurl = process.env.NEXT_PUBLIC_SPRING_API;

  useEffect(() => {
    if (user) {
      axios
        .get(`${springurl}/api/order/reads`)
        .then((res) => {
          const fetched = res.data?.content?.orders || [];
          setOrders(fetched);
        })
        .catch((err) => console.error("신청 내역 불러오기 실패", err));
    }
  }, [user]);

  const toggleDetail = async (orderId: string) => {
    if (openOrderId === orderId) {
      setOpenOrderId(null);
      return;
    }

    if (!orderDetails[orderId]) {
      try {
        const res = await axios.get(`${springurl}/api/order/detail`, {
          params: { orderId },
        });
        const detail = res.data?.content?.orderResponse;
        setOrderDetails((prev) => ({ ...prev, [orderId]: detail }));
      } catch (err) {
        console.error("상세 내역 불러오기 실패", err);
      }
    }

    setOpenOrderId(orderId);
  };

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
    <div className="space-y-6 p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-300">
        신청 내역
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-400 text-sm sm:text-base">신청 내역이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.orderId}
              className="bg-[#334155]/60 border border-blue-900 rounded-xl p-4 sm:p-5"
            >
              <button
                className="w-full text-left flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0"
                onClick={() => toggleDetail(order.orderId)}
              >
                <span className="text-sm sm:text-base">
                  <span className="font-semibold text-cyan-200">주문번호:</span>{" "}
                  {order.orderId}
                </span>
                <span className="text-xs sm:text-sm text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </button>

              {openOrderId === order.orderId &&
                orderDetails[order.orderId] && (
                  <div className="mt-4 border-t border-gray-700 pt-4 space-y-4 text-sm text-gray-200">

                    {/* 이미지 */}
                    {orderDetails[order.orderId].filePath && (
                      <div className="w-full flex justify-center">
                        <img
                          src={`${springurl}${orderDetails[order.orderId].filePath}`}
                          alt="신청 이미지"
                          className="max-w-full sm:max-w-xs rounded-lg border border-gray-700"
                        />
                      </div>
                    )}

                    {/* 항목 리스트 */}
                    <div className="space-y-2">
                      {orderDetails[order.orderId].orderItems?.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm sm:text-base"
                          >
                            <span>{item.itemName}</span>
                            <span>{item.itemPrice.toLocaleString()}원</span>
                          </div>
                        )
                      )}
                    </div>

                    {/* 총합 */}
                    <div className="text-right font-semibold text-cyan-300">
                      총합:{" "}
                      {orderDetails[order.orderId].order.totalPrice.toLocaleString()}원
                    </div>
                  </div>
                )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
