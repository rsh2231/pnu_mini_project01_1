"use client";

import { useState } from "react";
import { useFetchUser } from "@/hooks/useFetchUser";
import { User } from "@/type/user";
import axios from "axios";
import { toast } from "react-toastify";
import Button01 from "@/components/etc/Button01";

export default function ProfilePage() {
  const { user, loading, refetch } = useFetchUser();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<User>({
    username: "",
    nickname: "",
    address: "",
  });

  const springurl = process.env.NEXT_PUBLIC_SPRING_API;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditClick = () => {
    if (!user) return;
    setEditing(true);
    setFormData({
      username: user.username,
      nickname: user.nickname,
      address: user.address,
    });
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const payload = { content: { member: formData } };

      await axios.post(`${springurl}/api/useredit`, payload, {
        headers: {
          Authorization: token || "",
        },
        withCredentials: true,
      });

      toast.success("✅ 정보가 성공적으로 수정되었습니다.");
      setEditing(false);
      // 최신 사용자 정보 다시 불러오기
      await refetch();
    } catch (err) {
      console.error(err);
      toast.error("❌ 정보 수정 중 오류가 발생했습니다.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-300 font-bold">로딩중... ⏳</p>
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-300 font-bold">
          로그인 후 이용 가능합니다.
        </p>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 border-b border-blue-900 pb-4">
        🧑 내 정보
      </h1>

      <div className="bg-[#1e293b]/70 backdrop-blur-md rounded-xl p-6 space-y-6 border border-blue-900 shadow-lg">
        {!editing ? (
          <>
            <InfoRow label="아이디" value={user.username} />
            <InfoRow label="닉네임" value={user.nickname} />
            <InfoRow label="주소" value={user.address} />
            <div className="flex justify-end">
              <Button01
                caption="✏️ 정보 수정"
                bg_color="blue"
                onClick={handleEditClick}
              />
            </div>
          </>
        ) : (
          <form className="space-y-5">
            <FormField
              label="아이디"
              name="username"
              value={formData.username}
              disabled
            />
            <FormField
              label="닉네임"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
            />
            <FormField
              label="주소"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
              >
                저장
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="border border-gray-600 hover:bg-white/10 text-gray-300 px-5 py-2 rounded-md transition"
              >
                취소
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray-300 py-2 border-b border-white/10">
      <span className="font-medium text-sm sm:text-base whitespace-nowrap min-w-[80px]">
        {label}:
      </span>
      <span className="text-sm sm:text-base break-words text-gray-100">
        {value}
      </span>
    </div>
  );
}


function FormField({
  label,
  name,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-300 mb-1">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`w-full px-4 py-2 rounded-md border transition focus:outline-none focus:ring-2 focus:ring-teal-400 ${
          disabled
            ? "bg-gray-800 text-gray-500 cursor-not-allowed"
            : "bg-slate-800 text-white border-blue-900"
        }`}
      />
    </div>
  );
}
