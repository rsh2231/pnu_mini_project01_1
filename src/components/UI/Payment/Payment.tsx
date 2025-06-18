"use clinet";

import { useState } from "react";
import Resister from "../Register/Register";
import Button01 from "@/components/etc/Button01";
import DefalutLogin from "../Login/DefalutLogin";
import axios from "axios";

export default function Payment<T>({
  onclose,
  jobid,
  data,
}: {
  onclose: () => void;
  jobid: string;
  data: any;
}) {
  const sorteditems = data;
  console.log("품목", sorteditems);
  {
    sorteditems.map((i: any) =>
      i.map((i: any) => {
        const a = parseInt(i.수수료);
      })
    );
  }
  // route.push(`/resultpage/${res.data.spring_response.data.jobid}/payment`)
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-slate-100 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
        <div className="border-b border-gray-300 pb-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">결제 상세</h2>
        </div>

        <div className="flex flex-col space-y-2 text-gray-800 text-sm mb-6">
          {sorteditems.map((i: any) =>
            i.map((i: any) => (
              <span key={i}>
                {i.연번}. {i.품명} ({i.규격}) - {i.수수료}원
              </span>
            ))
          )}
        </div>

        <div className="text-right text-lg font-semibold text-gray-900 mb-6">
          총 수수료:{" "}
          {sorteditems
            .flat()
            .reduce(
              (total: number, item: any) =>
                total + (parseInt(item.수수료) || 0),
              0
            )}
          원
        </div>

        <div className="flex justify-end space-x-3">
          <Button01 caption="결제" bg_color="blue" />
          <Button01 caption="닫기" bg_color="orange" onClick={onclose} />
        </div>
      </div>
    </div>
  );
}
