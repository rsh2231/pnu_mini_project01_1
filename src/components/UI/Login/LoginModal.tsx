"use client";

import { useState } from "react";
import Resister from "../Register/Register";
import DefalutLogin from "./DefalutLogin";
import Button01 from "@/components/etc/Button01";
import SocialLogin from "./SocialLogin";

export default function LoginModal({ onclose }: { onclose: () => void }) {
  const [formType, setFormType] = useState<"login" | "register">("login");

   return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white/95 dark:bg-gray-100/90 rounded-xl w-[360px] max-w-full p-6 shadow-xl border border-teal-300 dark:border-teal-400 flex flex-col">
        {/* 탭 버튼 */}
        <div className="flex justify-center items-center gap-3 mb-4">
          <Button01
            caption="로그인"
            bg_color={formType === "login" ? "blue" : "cyan"}
            onClick={() => setFormType("login")}
          />
          <Button01
            caption="회원가입"
            bg_color={formType === "register" ? "blue" : "cyan"}
            onClick={() => setFormType("register")}
          />
        </div>

        {/* 구분선 */}
        <hr className="border-teal-300 dark:border-teal-400 mb-4" />

        {/* 폼 */}
        <div className="mt-6 flex-grow">
          {formType === "login" ? (
            <DefalutLogin onclose={onclose} />
          ) : (
            <Resister onclose={onclose}/>
          )}
        </div>

        {/* 소셜 로그인 */}
        <p className="text-teal-600 dark:text-teal-500 font-semibold mb-3 text-center">
          소셜 로그인
        </p>
        <SocialLogin />

        {/* 닫기 버튼 */}
        <button
          onClick={onclose}
          className="mt-6 self-center text-teal-700 hover:text-teal-900 dark:text-teal-500 dark:hover:text-teal-700 transition font-semibold cursor-pointer"
          aria-label="닫기"
        >
          닫기
        </button>
      </div>
    </div>
  );
}