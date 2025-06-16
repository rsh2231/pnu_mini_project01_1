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
      <div className="mb-2 w-full max-w-xs">
        <input
          type={type}
          {...registration}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="bg-gray-700 focus:outline-none w-full p-2 pl-4 rounded text-white"
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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
      className="m-2 flex flex-col gap-3 w-full max-w-xs mx-auto"
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
        className="bg-blue-600 hover:bg-blue-500 text-white w-full max-w-xs p-2 rounded hover:cursor-pointer"
      >
        등록
      </button>
    </form>
  );
}
