"use client";

declare global {
  interface Window {
    daum?: any;
  }
}

import { useForm, FormProvider, useFormContext } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";
import { RegisterType } from "@/type/registerinfo";

export default function Register({ onclose }: { onclose: () => void }) {
  const methods = useForm<RegisterType>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  useEffect(() => {
    // 카카오 주소 API 스크립트 동적 로딩
    const script = document.createElement("script");
    script.src =
      "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

  function AddressField() {
    const { setValue, register } = useFormContext();
    const [address, setAddress] = useState("");

    const handleAddressSearch = () => {
      if (typeof window.daum === "undefined") {
        alert(
          "주소 검색 스크립트를 불러오는 중입니다. 잠시 후 다시 시도해주세요."
        );
        return;
      }

      const width = 500;
      const height = 600;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;

      new window.daum.Postcode({
        popupOptions: {
          width,
          height,
          left,
          top,
        },
        oncomplete: function (data: any) {
          const fullAddress = data.address;
          setAddress(fullAddress);
          setValue("address", fullAddress);
        },
      }).open();
    };

    return (
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {/* 기본 주소 */}
        <input
          type="text"
          value={address}
          readOnly
          placeholder="주소를 검색하세요"
          className="bg-white/80 text-gray-800 w-full px-4 py-2 rounded-md border border-teal-300 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-400 transition"
        />
        <button
          type="button"
          onClick={handleAddressSearch}
          className="text-sm mt-1 text-teal-600 underline self-start"
        >
          주소 검색
        </button>

        {/* 상세 주소 입력란 */}
        <input
          type="text"
          {...register("detailAddress")}
          placeholder="상세 주소를 입력하세요"
          className="bg-white/80 text-gray-800 w-full px-4 py-2 rounded-md border border-teal-300 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-400 transition"
        />
      </div>
    );
  }

  const onSubmit = async (data: RegisterType) => {
    // address와 detailAddress 합치기 (detailAddress가 있을 때만)
    const fullAddress =
      data.address + (data.detailAddress ? ` ${data.detailAddress}` : "");

    // enabled는 기본 true로 설정 (RegisterType에 정의되어 있음)
    const payload = { ...data, address: fullAddress, enabled: true };

    try {
      const response = await axios.post("/api/register", payload);
      if (
        response.status === 200 &&
        response.data === "이미 존재하는 아이디 입니다."
      ) {
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
    <FormProvider {...methods}>
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

        <AddressField />

        <button
          type="submit"
          className="bg-white/80 text-teal-700 font-semibold rounded-md py-2 border border-teal-300 hover:bg-white hover:shadow-md transition cursor-pointer"
        >
          회원가입
        </button>
      </form>
    </FormProvider>
  );
}
