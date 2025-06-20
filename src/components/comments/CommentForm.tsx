"use client";

import React, { useState, FormEvent } from "react";
import { useFetchUser } from "@/hooks/useFetchUser";
import { useCommentSubmit } from "@/hooks/useCommentSubmit";
import { glass_button_variants } from "@/styles/button";

interface CommentFormProps {
  dashId: number;
  parentId?: number | null;
  onCommentPosted?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  dashId,
  parentId = null,
  onCommentPosted,
}) => {
  const [content, setContent] = useState("");
  const { user, loading } = useFetchUser();
  const { submitComment } = useCommentSubmit();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (loading) {
      alert("사용자 정보를 불러오는 중입니다.");
      return;
    }

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (content.trim() === "") {
      alert("댓글 내용을 입력하세요.");
      return;
    }

    const success = await submitComment({
      dashId,
      parentId,
      content,
      user,
    });

    if (success) {
      setContent("");
      onCommentPosted?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-4 space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요"
        className="w-full p-3 border border-slate-700 rounded-lg resize-y bg-slate-800 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
        rows={4}
        disabled={loading || !user}
      />
      <div className="flex justify-end">
        <button
          type="submit"
          className={glass_button_variants.blue}
          disabled={loading || !user}
        >
          댓글 등록
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
