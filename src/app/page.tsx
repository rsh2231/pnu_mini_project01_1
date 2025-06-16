"use client"

import { useAtom } from "jotai";
import { isLoginAtom } from "@/atoms/IsLoginAtom";
import ImageSendingForm from "@/components/UI/ImageForm/ImageSendingForm";

export default function Home() {
  const [loginstate] = useAtom(isLoginAtom);

  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <section className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight drop-shadow-lg">
          ♻ 부산 폐기물 자동 분류 시스템
        </h1>
        <p className="text-base sm:text-lg text-gray-400 max-w-2xl leading-relaxed">
          폐기물 이미지를 업로드하면 종류를 자동 분류하고, <br />
          지자체 신고와 결제를 간편하게 처리합니다.
        </p>
      </section>

      <div className="flex justify-center mt-8">
        {/* {loginstate.isLogin === "logged-in" ? ( */}
          <ImageSendingForm />
        {/* ) : (
          <p className="text-gray-400">로그인 후 이미지 업로드가 가능합니다.</p>
        )} */}
      </div>
    </div>
  );
}
