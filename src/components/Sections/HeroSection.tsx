"use client";

import ImageSendingForm from "@/components/UI/ImageForm/ImageSendingForm";
import { useAtom } from "jotai";
import { isLoginAtom } from "@/atoms/IsLoginAtom";

export default function HeroSection() {
  const [loginInfo] = useAtom(isLoginAtom); // 로그인 상태 가져오기

  return (
    <section className="w-full bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#1e3a8a] p-10 pb-40 text-white text-center shadow-lg space-y-16">
      <h1 className="text-5xl sm:text-6xl font-extrabold leading-relaxed">
        <span className="text-cyan-300">부산시 폐기물 처리,</span>
        <br /> 이제 스마트하게.
      </h1>
      <p className="text-base sm:text-lg text-gray-200 max-w-2xl leading-relaxed mx-auto m-4">
        폐기물 이미지를 업로드하면 종류를 자동 분류하고, <br />
        지자체 신고와 결제를 간편하게 처리합니다.
      </p>

      {/* 로그인된 경우에만 폼 렌더링 */}
      {loginInfo.isLogin === "logged-in" ? (
        <ImageSendingForm />
      ) : (
        <p className="text-sm text-gray-400">
          이미지를 업로드하려면 로그인해 주세요.
        </p>
      )}
    </section>
  );
}
