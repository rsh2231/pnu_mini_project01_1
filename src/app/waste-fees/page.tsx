"use client";

import { useState } from "react";
import { getDistricts, getFeesByDistrict } from "@/lib/loadfee";
import FeeTable from "@/components/wastefee/FeeTable";
import WasteInfoBox from "@/components/wastefee/WasteInfoBox";

export default function WasteFeesClientPage() {
  const districts = getDistricts();
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const fees = selectedDistrict ? getFeesByDistrict(selectedDistrict) : [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 relative z-10 space-y-12">
      {/* 대형폐기물 설명 박스 */}
      <WasteInfoBox />
      {/* 구/군 선택 */}
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

      {selectedDistrict && (
        <FeeTable
          fees={fees}
          title={`${selectedDistrict} 대형 폐기물 수수료 목록`}
        />
      )}
    </div>
  );
}
