"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import Button01 from "@/components/etc/Button01";
import Payment from "@/components/UI/Payment/Payment";
import VideoUploadModal from "@/components/UI/Video/VideoUploadModal";

export default function ImgSelectButton({
  permitRequest,
  setSelectedIdx,
}: {
  permitRequest: ImagePermitRequestDTO;
  setSelectedIdx: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const [payment, setPayment] = useState<React.JSX.Element | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [springData, setSpringData] = useState<any>(null);
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null); // ✅ 영상 상태 저장
  const router = useRouter();

  const handleClick = () => {
    setSelectedIdx([]);
  };

  // 승인 후 영상 업로드 모달 열기
  const imgPermtTOPython = async () => {
    try {
      const res = await axios.post("/api/imgPermit", permitRequest, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.spring_response.status === "200") {
        setSpringData(res.data.spring_response.data.body);
        console.log("ImgSelectButton: imgPermtTOPython success, showing video modal.");
        setShowVideoModal(true);
      }
    } catch (error: any) {
      toast.error("❌ 승인할 수 없는 품목이 포함되어 있습니다.");
      console.error("API 호출 실패:", error.response?.data || error.message);
    }
  };

  // ✅ 결제 성공 후: 최종 영상 업로드
  const handleVideoUploadAndFinalize = async (orderId: string) => {
    console.log("ImgSelectButton: handleVideoUploadAndFinalize called with orderId:", orderId);
    if (uploadedVideo) {
      console.log("ImgSelectButton: uploadedVideo is present. Attempting upload.", uploadedVideo.name);
      const formData = new FormData();
      formData.append("orderId", orderId);
      formData.append("file", uploadedVideo);

      try {
        await axios.post("/api/video/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("✅ 영상 최종 업로드 완료");
      } catch (error) {
        toast.error("❌ 영상 업로드 실패");
        console.error("ImgSelectButton: Video upload failed.", error);
      }
    }

    setPayment(null);
    setSelectedIdx([]);
    router.push("/");
  };

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
        <Button01 caption="메인페이지" bg_color="cyan" onClick={() => router.push("/")} />
      </div>

      {showVideoModal && (
        <VideoUploadModal
          onClose={() => setShowVideoModal(false)}
          onFileSelected={(file) => {
            setUploadedVideo(file); // ✅ 상위 상태에 저장
            console.log("ImgSelectButton: uploadedVideo set to", file.name);
            setShowVideoModal(false); // 모달 닫기
            setPayment(
              <Payment
                onclose={() => setPayment(null)}
                data={springData}
                originaldata={permitRequest}
                onSuccess={handleVideoUploadAndFinalize} // ✅ 결제 후 영상 업로드
              />
            );
          }}
        />
      )}

      {payment}
    </div>
  );
}
