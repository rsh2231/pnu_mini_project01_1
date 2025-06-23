"use client";

import { useEffect, useRef, useState } from "react";
import ImgSelectButton from "./imgSelectButton";
import Button01 from "@/components/etc/Button01";
import Polybutton from "./polybutton";
import { canvas } from "framer-motion/client";
import Link from "next/link";
import { productselected } from "@/styles/productSelection";
import { glass_button_variants } from "@/styles/button";
import { toast } from "react-toastify";

export default function ResultRender({
  apiRespone,
  jobid,
}: {
  apiRespone: ApiResponseDTO<ImageProcessResultDTO>;
  jobid: string;
}) {
  const [selectedIdx, setSelectedIdx] = useState<number[]>([]);
  const [selectedname, setSelectedname] = useState<string[]>([]);
  const [selectedtype, setSelectedtype] = useState<string[]>([]);
  const [imwidth, setwidth] = useState<number>();
  const [imheight, setheight] = useState<number>();
  const result = apiRespone.data;

  useEffect(() => {
    console.log("ResultRender - 업데이트된 itemlist:", selectedIdx);

    if (selectedIdx.length >= result.names.length) {
      console.log("ResultRender - 최대선택");
      toast.info("모두 선택 하셨습니다.", { autoClose: 1000 });
    }
    selectedIdx.map((i) =>
      console.log(
        "ResultRender - 선택한 내용 : ",
        result.names[i],
        " ",
        result.type[i]
      )
    );
    setSelectedname(selectedIdx.map((i) => result.names[i]));
    setSelectedtype(selectedIdx.map((i) => result.type[i]));
  }, [selectedIdx]);

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    console.log(img);
    if (img && img.complete) {
      console.log(
        "ResultRender - Original size:",
        img.naturalWidth,
        img.naturalHeight
      );
    }
  }, [result.image_base64]);

  const handleonLoad = (e: any) => {
    const img = e.target as HTMLImageElement;
    setTimeout(() => setwidth(img.width), 100);
    setTimeout(() => setheight(img.height), 100);
    setTimeout(
      () => console.log("ResultRender - 이미지사이즈", img.width),
      100
    );
  };

  const [w, h] = result.viewSize;

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8 max-w-[680px] mx-auto">
      {/* ✅ 이미지 및 SVG 프리뷰 영역 (반응형으로 개선) */}
      <div
        className="relative w-full"
        style={{ aspectRatio: `${w} / ${h}`, maxHeight: "80vh" }}
      >
        {/* ❗ 절대 수정 금지 영역 시작 */}
        <div className="relative w-full h-full">
          <img
            src={result.image_base64}
            alt="result"
            className="w-full h-full object-contain border pointer-events-none"
            onLoad={handleonLoad}
            ref={imgRef}
          />
          <svg
            viewBox={`0 0 ${w} ${h}`}
            className="absolute top-0 left-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <Polybutton
              names={result.names}
              poly={result.poly}
              jobid={jobid}
              setSelectedIdx={setSelectedIdx}
              selectedIdx={selectedIdx}
            />
          </svg>
        </div>
        {/* ❗ 절대 수정 금지 영역 끝 */}
      </div>

      {/* ✅ 현재 선택 영역 */}
      <div className="m-6 text-center font-semibold text-slate-200 text-base sm:text-lg">
        현재 선택
      </div>
      <div className="flex flex-wrap justify-center gap-2 text-sm border rounded-lg p-4 max-w-full w-full mx-auto">
        {selectedIdx.map((i) => (
          <span
            key={i}
<<<<<<< HEAD
            className={`${
              glass_button_variants.blue
            } inline-flex items-center justify-center px-3 py-1 text-xs sm:text-sm text-center truncate max-w-[150px]`}
=======
            className={`${glass_button_variants.blue} inline-flex items-center justify-center px-3 py-1 text-xs sm:text-sm text-center truncate max-w-[150px]`}
>>>>>>> master
            title={result.names[i]}
          >
            {result.names[i]}
          </span>
        ))}
      </div>

      {/* ✅ 버튼 영역 */}
      <div className="flex flex-wrap justify-center gap-3 mt-4 max-w-full w-full">
        <ImgSelectButton
          permitRequest={{ selectedIdx, selectedname, jobid }}
          setSelectedIdx={setSelectedIdx}
        />
      </div>
    </div>
  );
}