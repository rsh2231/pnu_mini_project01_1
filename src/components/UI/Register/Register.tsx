'use client';

import { RegisterType } from "@/type/registerinfo";
import axios from "axios";
import { useForm } from "react-hook-form";

export default function Register({ onclose }: { onclose: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterType>();

  const inputRule = {
    required: "필수입력입니다.",
    pattern: {
      value: /^[a-zA-Z0-9ㄱ-ㅎ가-힣]+$/,
      message: "형식이 틀림",
    },
  };

  type RegisterInputField = {
    type: string;
    placeholder: string;
    autoComplete?: string;
    error?: string;
    registration: ReturnType<typeof register>;
  };

  function InputField({
    type,
    placeholder,
    autoComplete,
    error,
    registration,
  }: RegisterInputField) {
    return (
      <div className="flex flex-col gap-1 w-full max-w-xs">
        <input
          type={type}
          {...registration}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="bg-white/80 text-gray-800 w-full px-4 py-2 rounded-md border border-teal-300 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-400 transition"
        />
        {error && (
          <p className="text-red-500 text-sm px-1 font-medium">{error}</p>
        )}
      </div>
    );
  }

  const onSubmit = async (data: RegisterType): Promise<void> => {
    const payload = { ...data, enabled: true };
    try {
      const response = await axios.post("/api/register", payload);
      if (response.status === 200 && response.data === "이미 존재하는 아이디 입니다.") {
        alert(response.data);
      } else {
        alert(response.data);
        onclose();
      }
    } catch (error) {
      console.error("회원가입 실패", error);
    }
  };

  return (
    <form
      className="m-4 flex flex-col gap-4 bg-white/70 rounded-xl p-6 shadow-md border border-teal-200 w-80 mx-auto backdrop-blur-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <InputField
        type="text"
        placeholder="아이디"
        autoComplete="username"
        registration={register("username", inputRule)}
        error={errors.username?.message?.toString()}
      />
      <InputField
        type="password"
        placeholder="비밀번호"
        autoComplete="current-password"
        registration={register("password", inputRule)}
        error={errors.password?.message?.toString()}
      />
      <InputField
        type="text"
        placeholder="닉네임"
        autoComplete="nickname"
        registration={register("nickname", inputRule)}
        error={errors.nickname?.message?.toString()}
      />

      <button
        type="submit"
        className="bg-white/80 text-teal-700 font-semibold rounded-md py-2 border border-teal-300 hover:bg-white hover:shadow-md transition cursor-pointer"
      >
        회원가입
      </button>
    </form>
  );
}
