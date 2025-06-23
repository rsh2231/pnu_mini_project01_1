"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useFetchUser } from "@/hooks/useFetchUser";

export default function MyOrderHistoryPage() {
  const { user, loading } = useFetchUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<Record<string, any>>({});
  const [imageDataMap, setImageDataMap] = useState<Record<string, string>>({});
  const springurl = process.env.NEXT_PUBLIC_SPRING_API;

  useEffect(() => {
    if (
      openOrderId &&
      orderDetails[openOrderId]?.filePath &&
      !imageDataMap[openOrderId]
    ) {
      const fetchImage = async () => {
        try {
          const rawPath = orderDetails[openOrderId].filePath;
          const res = await axios.get(
            `${springurl}/api/image/processed/${rawPath}`
          );
          const base64 = res.data.data.image_base64;
          if (base64) {
            setImageDataMap((prev) => ({ ...prev, [openOrderId]: base64 }));
          }
        } catch (e) {
          console.error("이미지 불러오기 실패", e);
        }
      };
      fetchImage();
    }
  }, [openOrderId]);

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (user) {
      axios
        .get(`${springurl}/api/order/reads`, {
          headers: { Authorization: token },
        })
        .then((res) => {
          const fetched = res.data?.content?.orders || [];
          const sorted = fetched.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setOrders(sorted);
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

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg sm:text-xl text-gray-300 font-semibold">
        {loading ? "로딩중... ⏳" : "로그인 후 이용 가능합니다."}
      </div>
    );
  }

  // 품목 요약 텍스트 반환 함수
  const getSummaryItemName = (items: any[]) => {
    if (!items || items.length === 0) return "품목 없음";

    return items;
  };

  // 품목명 앞 숫자 제거 함수
  const removePrefix = (name: string = "") => {
    return name.replace(/^\d+_/, ""); // 숫자+_ 제거
  };

  return (
    <div className="px-4 py-6 max-w-screen-md mx-auto space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-cyan-300">
        📦 신청 내역
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-400 text-sm">신청 내역이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order, index) => {
            const isOpen = openOrderId === order.orderId;
            const detail = orderDetails[order.orderId];
            const imageBase64 = imageDataMap[order.orderId];

            return (
              <li
                key={order.orderId}
                className="rounded-xl border border-cyan-800 bg-slate-800/60 hover:bg-slate-700/40 transition duration-200"
              >
                <button
                  onClick={() => toggleDetail(order.orderId)}
                  className="w-full p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-left"
                >
                  <div>
                    <p className="font-semibold text-cyan-200 text-sm sm:text-base">
                      {index + 1}.{" "}
                      {order.itemPrice
                        ? (() => {
                            const entries = Object.entries(order.itemPrice);
                            const firstItem = removePrefix(entries[0]?.[0]);
                            const itemCount = entries.length;
                            return itemCount === 1
                              ? firstItem
                              : `${firstItem} 외 ${itemCount - 1}건`;
                          })()
                        : "📦 품목 불러오기"}
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-cyan-400 text-xs sm:text-sm mt-1 sm:mt-0">
                    {isOpen ? "▲ 닫기" : "▼ 열기"}
                  </span>
                </button>

                {isOpen && detail && (
                  <div className="px-4 pb-4 space-y-4">
                    {/* 이미지 */}
                    {imageBase64 && (
                      <div className="overflow-hidden rounded-lg border border-gray-600 shadow-md w-full sm:max-w-xs mx-auto">
                        <img
                          src={`data:image/jpeg;base64,${imageBase64}`}
                          alt="신청 이미지"
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )}

                    {/* 항목 리스트 */}
                    <div className="space-y-2">
                      {detail.orderItems?.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-sm sm:text-base text-gray-200"
                        >
                          <span>{item.itemName}</span>
                          <span>{item.itemPrice.toLocaleString()}원</span>
                        </div>
                      ))}
                    </div>

                    {/* 총합 */}
                    <div className="text-right font-semibold text-cyan-300 pt-2 border-t border-gray-700 text-sm sm:text-base">
                      총합:{" "}
                      {detail.orderItems
                        ?.reduce(
                          (acc: number, item: any) =>
                            acc + Number(item.itemPrice || 0),
                          0
                        )
                        .toLocaleString()}
                      원
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
