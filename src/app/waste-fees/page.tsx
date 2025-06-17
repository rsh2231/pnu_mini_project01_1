"use client";

import { useState } from "react";
import { getDistricts, getFeesByDistrict } from "@/lib/loadfee";

type FeeItem = {
  대형폐기물명: string;
  대형폐기물규격: string;
  수수료: number | string;
};

export default function WasteFeesClientPage() {
  const districts = getDistricts();
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const fees: FeeItem[] = selectedDistrict ? getFeesByDistrict(selectedDistrict) : [];

  // 품목별로 그룹화
  // { 품목명: FeeItem[] }
  const groupedByName: Record<string, FeeItem[]> = {};
  fees.forEach((fee) => {
    if (!groupedByName[fee.대형폐기물명]) groupedByName[fee.대형폐기물명] = [];
    groupedByName[fee.대형폐기물명].push(fee);
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 relative z-10 space-y-12">
      {/* 대형폐기물 설명 박스 */}
      <div className="bg-[#0f172a]/80 text-blue-100 border-l-4 border-blue-500 p-6 rounded-lg shadow mb-10">
        <h2 className="text-4xl text-cyan-300 font-semibold mb-2">대형폐기물이란?</h2>
        <p className="mb-1 text-2xl text-white">
          크기와 상관없이 <strong>종량제봉투로 배출해서는 안되는 폐기물</strong>을 말합니다.
        </p>
        <ul className="list-disc list-inside space-y-1 text-xl text-white">
          <li>이불, 베개, 담요 등 원단류 및 솜</li>
          <li>가구, 사무용 기자재, 생활용품 등 품명식별이 가능한 폐기물</li>
          <li>
            예: 나무, 전기방석, 장난감, 우산, 장판, 도배지, 가방, 액자, 쿠션, 벽시계, 폐소화기 등
          </li>
        </ul>
      </div>

      {/* 구군 선택 */}
      <div className="bg-[#1e293b]/80 shadow-lg rounded-xl border border-blue-900 p-6">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">부산시 구·군 선택</h1>
        <ul className="grid grid-cols-2 sm:grid-cols-7 gap-4">
          {districts.map((name) => (
            <li key={name}>
              <button
                onClick={() => setSelectedDistrict(name)}
                className={`w-full text-center px-4 py-3 rounded-lg font-medium border transition duration-200 ${
                  selectedDistrict === name
                    ? "bg-blue-600 text-white border-blue-500"
                    : "bg-[#334155] hover:bg-[#475569] text-blue-100 border-blue-800"
                }`}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 수수료 목록 */}
      {selectedDistrict && (
        <div className="bg-[#1e293b]/80 shadow-md rounded-lg border border-blue-900 p-6 overflow-x-auto">
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">
            {selectedDistrict} 대형 폐기물 수수료 목록
          </h2>
          <table className="w-full text-sm border-collapse border border-blue-900">
            <thead className="bg-[#334155]/90 text-blue-100">
              <tr>
                <th className="px-4 py-2 border border-blue-900 text-center">품목</th>
                <th className="px-4 py-2 border border-blue-900 text-center">규격</th>
                <th className="px-4 py-2 border border-blue-900 text-center">수수료 (원)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedByName).map(([name, items]) =>
                items.map((item, idx) => (
                  <tr
                    key={`${name}-${idx}`}
                    className={idx % 2 === 0 ? "bg-[#1e293b]/50" : "bg-[#0f172a]/50"}
                  >
                    {/* 첫 행에만 품목 셀과 rowspan 설정 */}
                    {idx === 0 && (
                      <td
                        rowSpan={items.length}
                        className="px-4 py-2 border border-blue-900 text-center align-middle"
                      >
                        {name}
                      </td>
                    )}
                    <td className="px-4 py-2 border border-blue-900 text-center">{item.대형폐기물규격}</td>
                    <td className="px-4 py-2 border border-blue-900 text-center">
                      {Number(item.수수료).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
