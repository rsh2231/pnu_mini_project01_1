"use client";

import { isLoginAtom } from "@/atoms/IsLoginAtom";
import { glass_button_variants } from "@/styles/button";
import { Logininfo } from "@/type/logininfo";
import axios from "axios";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function ImageSendingForm() {
  const route = useRouter();
  const { register, handleSubmit, setValue, watch } = useForm();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isClientMobile, setIsClientMobile] = useState(false);
  const [isSubmit, setisSubmit] = useState(false);
  const imageCam = watch("inputFromCam");
  const imageFile = watch("inputFromFile");
  const [loginstate, setloginstate] = useAtom<Logininfo>(isLoginAtom);

  const mobileButton = [
    {
      htmlFor: "inputFromCam",
      text: "카메라 촬영",
      classname: glass_button_variants.blue,
    },
    {
      htmlFor: "inputFromFile",
      text: "파일로 등록",
      classname: glass_button_variants.cyan,
    },
  ];


  const MAX_SIZE = 680; // 최대 크기

  const [imgSize, setImgSize] = useState<{ width: number; height: number }>({
    width: 300,
    height: 300,
  });

  const [aspectRatio, setAspectRatio] = useState<string>("1 / 1");
  // ← 여기부터 새로 추가

  // 이미지 로드 시 aspect-ratio 계산
  const handlePreviewImageLoad = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const img = e.currentTarget;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    if (naturalWidth && naturalHeight) {
      setAspectRatio(`${naturalWidth} / ${naturalHeight}`);
    }
  };
  // ← 여기까지 새로 추가

  useEffect(() => {
    setIsClientMobile(isMobile);
  }, []);

  //이미지 업로드시 프리뷰 생성
  useEffect(() => {
    const file = imageFile?.[0] || imageCam?.[0];
    if (!file) {
      setImagePreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setImagePreview(url);

    if (!toast.isActive("image-selected")) {
      toast.success("이미지가 선택되었습니다.", { toastId: "image-selected" });
    }
  }, [imageCam, imageFile]);

  // 이미지 교차 선택시 값 비워서 중복 방지
  useEffect(() => {
    if (imageCam?.length > 0) {
      setValue("inputFromFile", []);
    }
  }, [imageCam]);

  useEffect(() => {
    if (imageFile?.length > 0) {
      setValue("inputFromCam", []);
    }
  }, [imageFile]);

  // 제출
  const onsubmit = async (data: any) => {
    //const reader = new FileReader(); base64방식으로 인코딩 하면 Json전송가능 하지만
    //Base64로 인코딩하면 원래 이미지보다 약 33% 용량 증가  고해상도 사진 전송 적합
    //대용량 이미지 여러 개를 보내면 네트워크와 메모리 사용이 커짐

    // inputimage는 File[] 타입이니까 [0]을 사용
    const file = data.inputFromFile?.[0] || data.inputFromCam?.[0];
    if (!file) {
      alert("이미지를 넣어 주세요");
      return;
    }

    if (isSubmit) {
      toast.error("이미지가 이미 제출 되었습니다.");
      return;
    } else {
      toast.info("이미지를 제출합니다.", { autoClose: 500 });
      setisSubmit(true);
    }

    console.log("ImageSendingForm => 폼입력 데이터", file);
    const username = loginstate.username ?? "";
    const formData = new FormData();
    formData.append("image", file);
    formData.append("username", username);
    const token = sessionStorage.getItem("jwtToken");

    try {
      const response = await axios.post("api/imgTopython", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        route.push(`/resultpage/${response.data.spring_response.data.jobid}`);
        console.log(
          "ImageSendingForm => api/imgTopython 전체데이터 ",
          response.data
        );
        console.log(
          "ImageSendingForm => api/imgTopython response.data.springresponse ",
          response.data.spring_response
        );
        console.log(
          "ImageSendingForm => api/imgTopython response.data.springresponse.data.jobid ",
          response.data.spring_response.data.jobid
        );
      } else {
        toast.error("서버 에러로 인한 전송 실패");
        setisSubmit(false);
      }
    } catch (error: any) {
      setisSubmit(false);
      toast.error(`서버 전송에 실패했습니다.${error}`, { autoClose: 3000 });
      console.log(error.response.data.error);
      console.log(error.response);
    }
  };

  const imgcancle = () => {
    setValue("inputFromFile", []);
    setValue("inputFromCam", []);
    setImagePreview("");
    toast.info("취소되었습니다.");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full px-4">
      {/* 업로드 버튼 그룹 */}
      <form
        onSubmit={handleSubmit(onsubmit)}
        className="flex flex-row sm:flex-row gap-4 items-center justify-center"
      >
        <input
          id="inputFromCam"
          type="file"
          accept="image/*"
          {...register("inputFromCam")}
          capture="environment"
          className="hidden"
        />
        <input
          id="inputFromFile"
          type="file"
          accept="image/*"
          {...register("inputFromFile")}
          className="hidden"
        />

        {isClientMobile ? (
          mobileButton.map(({ htmlFor, text, classname }) => (
            <label key={htmlFor} htmlFor={htmlFor} className={classname}>
              {text}
            </label>
          ))
        ) : (
          <label htmlFor="inputFromCam" className={glass_button_variants.blue}>
            사진 선택
          </label>
        )}

        <button className={glass_button_variants.cyan} type="submit">
          처리하기
        </button>
        <button
          className={glass_button_variants.orange}
          type="button"
          onClick={imgcancle}
        >
          취소
        </button>
      </form>

      {/* ✅ 프리뷰 영역 (ResultRender 스타일 동일 적용) */}
      <div
        className="relative w-full max-w-[680px] mx-auto mt-10"
        style={{
          aspectRatio: imagePreview ? undefined : "1 / 1",
        }}
      >
        <div className="relative w-full h-full">
          {imagePreview ? (
            <img
              key={imagePreview}
              src={imagePreview}
              alt="preview"
              className="w-full h-full object-contain border rounded-lg"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center border rounded-lg text-gray-400 text-sm text-center">
              이미지를 선택하면 미리보기가 표시됩니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
}