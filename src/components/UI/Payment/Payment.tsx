"use client";

import { useState } from "react";
import Button01 from "@/components/etc/Button01";
import { useRouter } from "next/navigation";
import axios from "axios";
import OrderPage from "@/components/order/OrderPage";
import { useFetchUser } from "@/hooks/useFetchUser";

export default function Payment({
  onclose,
  data,
  originaldata,
}: {
  onclose: () => void;
  data: any;
  originaldata: ImagePermitRequestDTO;
}) {
  const sorteditems = data.flat(); // 2중 배열이라면 평탄화

  const { user, loading } = useFetchUser();

  const [confirm, setconfirm] = useState<ImagePermitRequestDTO>(originaldata);

  const [selectedItems, setSelectedItems] = useState<Set<string>>(
    new Set(
      sorteditems.map(
        (item: any) =>
          `${item.index}_${item.furnitureList[0].품명}_${item.furnitureList[0].규격}`
      )
    )
  );

  const toggleSelect = (itemKey: string) => {
    const [indexStr, name, type] = itemKey.split("_");
    const idx = parseInt(indexStr);
    const rename = `${name}_${type}`;

    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      let newSelectedIdx = [...confirm.selectedIdx];
      let newSelectedName = [...confirm.selectedname];

      const idxPos = newSelectedIdx.indexOf(idx);

      if (newSet.has(itemKey)) {
        newSet.delete(itemKey);
        if (idxPos !== -1) {
          newSelectedIdx.splice(idxPos, 1);
          newSelectedName.splice(idxPos, 1);
        }
      } else {
        newSet.add(itemKey);
        newSelectedIdx.push(idx);
        newSelectedName.push(rename);
      }

      setconfirm({
        jobid: originaldata.jobid,
        selectedIdx: newSelectedIdx,
        selectedname: newSelectedName,
      });

      return newSet;
    });
  };

  const totalFee = sorteditems
    .filter((item: any) => {
      const key = `${item.index}_${item.furnitureList[0].품명}_${item.furnitureList[0].규격}`;
      return selectedItems.has(key);
    })
    .reduce((sum: number, item: any) => {
      return sum + parseInt(item.furnitureList[0].수수료 || "0");
    }, 0);

  const springurl = process.env.NEXT_PUBLIC_SPRING_API;

  const handlePaymentClick = async () => {
    console.log("originaldata", originaldata);
    console.log("confirm", confirm);
    console.log("selectedItems", selectedItems);
    console.log("sorteditems", sorteditems);

    // 실제 결제 요청 보내는 부분 (주석 처리 상태)
    try {
      const res = await axios.post(
        `${springurl}/api/inference/${originaldata.jobid}/permission/final`,
        confirm,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("제출 응답", res);
    } catch (error) {
      console.error("결제 오류", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <div className="border-b border-gray-300 pb-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            결제 상세
          </h2>
        </div>

        {/* 안내 문구 */}
        <div className="mb-6 text-center text-gray-600 text-sm sm:text-base leading-relaxed">
          품목을 클릭하여 <span className="font-semibold">선택하거나 해제</span>
          할 수 있습니다.
          <br />총 수수료는 선택된 품목들의 합계입니다.
        </div>

        {/* 품목 리스트 */}
        <div className="flex flex-col space-y-2 sm:space-y-3 text-gray-800 text-sm sm:text-base mb-8">
          {sorteditems.map((item: any) => {
            const furniture = item.furnitureList[0];
            const itemKey = `${item.index}_${furniture.품명}_${furniture.규격}`;
            const isSelected = selectedItems.has(itemKey);

            return (
              <button
                key={itemKey}
                onClick={() => toggleSelect(itemKey)}
                className={`w-full text-left rounded-lg px-3 py-2 sm:px-4 sm:py-3 border transition
                  ${
                    isSelected
                      ? "bg-blue-50 border-blue-400 font-semibold text-blue-800 shadow"
                      : "bg-white border-gray-300 hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                  }
                `}
                type="button"
              >
                <span className="mr-2 text-gray-400">{furniture.연번}.</span>
                <span>{furniture.품명}</span>
                <span className="ml-1 text-gray-500">({furniture.규격})</span>
                <span className="float-right font-mono">
                  {furniture.수수료}원
                </span>
              </button>
            );
          })}
        </div>

        {/* 총 수수료 */}
        <div className="text-right text-xl sm:text-2xl font-bold text-gray-900 mb-8">
          총 수수료:{" "}
          <span className="text-blue-600">{totalFee.toLocaleString()}원</span>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex justify-end space-x-4">
          <Button01
            caption="결제"
            bg_color="blue"
            onClick={handlePaymentClick}
          />
          {/* <OrderPage
            selectedItems={sorteditems.filter((item: any, idx: number) =>
              selectedItems.has(`${idx}_${item.품명}_${item.규격}`)
            )}
            user={user}
          /> */}
          <Button01 caption="닫기" bg_color="orange" onClick={onclose} />
        </div>
      </div>
    </div>
  );
}
