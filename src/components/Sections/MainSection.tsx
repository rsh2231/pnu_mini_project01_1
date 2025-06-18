"use client";

import ImageSendingForm from "@/components/UI/ImageForm/ImageSendingForm";
import { useAtom } from "jotai";
import { isLoginAtom } from "@/atoms/IsLoginAtom";

export default function MainSection() {
  const [loginInfo] = useAtom(isLoginAtom); // 로그인 상태 가져오기

  return (
    <section className="w-full bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#1e3a8a] px-4 py-16 text-white text-center shadow-lg space-y-12 sm:space-y-16">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-snug sm:leading-relaxed">
        <span className="text-cyan-300 block">부산시 폐기물 처리,</span>
        <span className="block">이제 스마트하게.</span>
      </h1>

      <p className="text-base sm:text-lg text-gray-200 max-w-xl leading-relaxed mx-auto px-2">
        폐기물 이미지를 업로드하면 종류를 자동 분류하고,<br className="hidden sm:block" />
        지자체 신고와 결제를 간편하게 처리합니다.
      </p>

      {loginInfo.isLogin === "logged-in" ? (
        <div className="max-w-md mx-auto px-2">
          <ImageSendingForm />
        </div>
      ) : (
        <p className="text-sm text-gray-400 px-4">
          이미지를 업로드하려면 로그인해 주세요.
        </p>
      )}
    </section>
  );
}
