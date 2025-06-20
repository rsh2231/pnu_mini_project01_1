"use client";

import { useState } from "react";
import { getFeesByDistrict } from "@/lib/loadfee";
import FeeTable from "@/components/wastefee/FeeTable";
import WasteInfoBox from "@/components/wastefee/WasteInfoBox";

export default function WasteFeesClientPage() {
  const districts = [
    "중구",
    "서구",
    "동구",
    "영도구",
    "부산진구",
    "동래구",
    "남구",
    "북구",
    "해운대구",
    "사하구",
    "금정구",
    "강서구",
    "연제구",
    "수영구",
    "사상구",
    "기장군",
  ];

  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const fees = selectedDistrict ? getFeesByDistrict(selectedDistrict) : [];

  const itemOptions = [...new Set(fees.map((f) => f.대형폐기물명))];

  const filteredFees =
    selectedItem != null
      ? fees.filter((f) => f.대형폐기물명 === selectedItem)
      : [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 relative z-10 space-y-12">
      <WasteInfoBox />

      {/* 구/군 선택 */}
      <div className="bg-[#1e293b]/80 shadow-lg rounded-xl border border-blue-900 p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
          부산시 구·군 선택
        </h1>
        <ul className="grid grid-cols-2 sm:grid-cols-7 gap-3 sm:gap-4">
          {districts.map((name) => (
            <li key={name}>
              <button
                onClick={() => {
                  setSelectedDistrict(name);
                  setSelectedItem(null); // 구/군 바꾸면 품목 초기화
                }}
                className={`w-full text-center px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium border transition duration-200 text-sm sm:text-base cursor-pointer ${
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

      {/* 품목 선택 셀렉트 박스 */}
      {selectedDistrict && (
        <div className="flex justify-center px-4">
          <div className="w-full max-w-md bg-[#1e293b]/80 shadow-md rounded-xl border border-blue-900 p-4 sm:p-6">
            <label className="block mb-3 sm:mb-4 text-white text-center font-semibold text-base sm:text-lg">
              품목 선택
            </label>
            <select
              value={selectedItem ?? ""}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-md bg-[#334155] text-white border border-blue-700 focus:outline-none text-sm sm:text-base cursor-pointer"
            >
              <option value="">품목을 선택하세요</option>
              {itemOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* 수수료 테이블 */}
      {selectedItem && filteredFees.length > 0 && (
        <FeeTable
          fees={filteredFees}
          title={`${selectedDistrict} - ${selectedItem} 수수료 목록`}
        />
      )}
    </div>
  );
}
