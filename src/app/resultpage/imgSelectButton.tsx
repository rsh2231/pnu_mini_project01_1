"use client";
import Button01 from "@/components/etc/Button01";
import Payment from "@/components/UI/Payment/Payment";
import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ImgSelectButton({
  permitRequest,
  setSelectedIdx,
}: {
  permitRequest: ImagePermitRequestDTO;
  setSelectedIdx: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const [payment, setpayment] = useState<React.JSX.Element>();
  const handleClick = () => {
    console.log("클릭됨!");
    setSelectedIdx([]);
  };
  const imgPermtTOPython = async () => {
    console.log("ImgSelectButton - 승인", permitRequest.jobid);
    console.log("ImgSelectButton - 승인", permitRequest.selectedIdx);
    console.log("ImgSelectButton - 승인", permitRequest.selectedname);
    try {
      const res = await axios.post("/api/imgPermit", permitRequest, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log('📄파이썬으로 선택한 데이터요청 :' , permitRequest)
      console.log("✅승인 결과 응답", res.data);
      console.log('✅승인 결과 데이터',res.data.spring_response.data.body);
      if (res.data.spring_response.status === "200" && res.status == 200) {
        setpayment(
          <Payment
            onclose={() => setpayment(undefined)}
            data={res.data.spring_response.data.body}
            originaldata={permitRequest}
          />
        );
      }
    } catch (error: any) {
      toast.error("❌ 승인할 수 없는 품목이 포함되어 있습니다.");
      console.error("API 호출 실패:", error.response?.data || error.message);
    }
  };

  const router = useRouter();

  return (
    <div className="mt-2">
      <div className="flex flex-row justify-center items-center gap-2">
        <Button01
          caption={`선택된 이미지 승인 (${permitRequest.selectedIdx.length})`}
          bg_color="blue"
          onClick={imgPermtTOPython}
          disabled={permitRequest.selectedIdx.length === 0}
        />
        <Button01 caption="초기화" bg_color="orange" onClick={handleClick} />
        <Button01
          caption="메인페이지"
          bg_color="cyan"
          onClick={() => router.push("/")}
        />
      </div>
      {payment}
    </div>
  );
}
