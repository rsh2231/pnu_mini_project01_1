"use client";
import { isLoginAtom } from "@/atoms/IsLoginAtom";
import { Logininfo } from "@/type/logininfo";
import axios from "axios";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function DefalutLogin({ onclose }: { onclose: () => void }) {
  const { register, handleSubmit } = useForm();
  const [, setLoginSate] = useAtom<Logininfo>(isLoginAtom);
  const router = useRouter();
  // 로그인 프로세스
  const onSubmit = async (data: any) => {
    toast.success("로그인성공", { autoClose: 1000 });
    try {
      const response = await axios.post("/api/login", data);
      console.log("client 응답 = >", response.data);

      if (response.status === 200) {
        setLoginSate({
          isLogin: "logged-in",

        });
        // const cookie = response.data['set-cookie'][0]
        const token = response.data.authorization;
        sessionStorage.setItem("jwtToken", `${token}`);

        setTimeout(() => {
          onclose(); // 모달 닫기
          router.push("/"); // 홈으로 자연스럽게 이동
        }, 1000);
      }
    } catch (error: any) {
      console.log("err", error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="m-4 sm:mt-10 w-full max-w-sm mx-auto flex flex-col gap-4 bg-white/70 rounded-xl p-4 sm:p-6 shadow-md border border-teal-200 backdrop-blur-sm"
    >
      <input
        type="text"
        {...register("username", { required: true })}
        placeholder="아이디"
        autoComplete="username"
        className="bg-white/60 border border-teal-200 text-gray-800 rounded-md px-4 py-2 placeholder:text-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
      />
      <input
        type="password"
        {...register("password", { required: true })}
        placeholder="비밀번호"
        autoComplete="current-password"
        className="bg-white/60 border border-teal-200 text-gray-800 rounded-md px-4 py-2 placeholder:text-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
      />
      <button
        type="submit"
        className="bg-white/80 text-teal-700 font-semibold rounded-md py-2 sm:py-2.5 border border-teal-300 hover:bg-white hover:shadow-md transition cursor-pointer text-sm sm:text-base"
      >
        로그인
      </button>
    </form>
  );
}
