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

  //     return (
  //         <div >
  //             {/* w에 절대 max주면 안됨!!!!! */}
  //             {/* svg에 w fit 절대 금지 */}
  //             <div className="relative ">
  //                 <img
  //                 src={result.image_base64}
  //                 alt="result"
  //                 className="w-full h-auto border pointer-events-none"
  //                 onLoad={handleonLoad}
  //                 />
  //                 <svg
  //                     viewBox={`0 0 ${result.viewSize[0]} ${result.viewSize[1]}`}
  //                     className="absolute top-0 left-0 w-full h-full"
  //                     preserveAspectRatio="xMidYMid meet"
  //                 >
  //                     <Polybutton names={result.names} poly={result.poly} jobid={jobid} setSelectedIdx={setSelectedIdx} selectedIdx={selectedIdx} />
  //                 </svg>
  //             </div>
  //             <div className="text-center">이미지 사이즈 : {imwidth},{imheight} </div>
  //             <div className='flex flex-row justify-center items-center mt-2'>
  //                 현재 선택:{selectedIdx.map(i=><span key={i} className={`${productselected} flex flex-row gap-2  items-center m-2 w-fit`} >{result.names[i]}</span>)}
  //             </div>
  //             {/* <ImgSelectButton permitRequest={selectedIdx} result={result} jobid={jobid} selectedname={selectedname}/> */}
  //             <ImgSelectButton permitRequest={{selectedIdx,selectedname,jobid}} setSelectedIdx={setSelectedIdx}/>
  //             <Link href='/' className={glass_button_variants.blue}>메인페이지</Link>
  //         </div>
  //     );
  // }

  return (
    <div className="w-7/10 max-w-screen-lg mx-auto px-4 space-y-4">
      {/* w에 절대 max주면 안됨!!!!! */}
      {/* svg에 w fit 절대 금지 */}
      <div className="relative w-full overflow-hidden rounded-lg border border-slate-700 shadow-lg">
        <img
          src={result.image_base64}
          alt="result"
          ref={imgRef}
          className="w-full h-auto pointer-events-none object-contain"
          onLoad={handleonLoad}
        />
        <svg
          viewBox={`0 0 ${result.viewSize[0]} ${result.viewSize[1]}`}
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

      <div className="text-sm text-center text-slate-400">
        이미지 사이즈: {imwidth},{imheight}
      </div>
      <div className="text-center font-semibold text-slate-200 text-base sm:text-lg">
        현재 선택
      </div>
      <div className="flex flex-wrap justify-center gap-2 text-sm border rounded-lg p-5 ">
        {selectedIdx.map((i) => (
          <span
            key={i}
            className={`${glass_button_variants.blue} px-3 py-1 text-xs sm:text-sm`}
          >
            {result.names[i]}
          </span>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-3 mt-2">
        <ImgSelectButton
          permitRequest={{ selectedIdx, selectedname, jobid }}
          setSelectedIdx={setSelectedIdx}
        />
      </div>
    </div>
  );
}
