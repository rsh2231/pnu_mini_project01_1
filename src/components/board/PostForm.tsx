"use client";

import React, { useState, useRef, FormEvent } from "react";
import { useFetchUser } from "@/hooks/useFetchUser";
import { usePostSubmit } from "@/hooks/usePostSubmit";
import { useImageUpload } from "@/hooks/useImageUpload";
import Button01 from "@/components/etc/Button01";

const PostForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  const { user, loading } = useFetchUser();
  const { submitPost } = usePostSubmit();
  const { uploadAndInsertImage } = useImageUpload(
    content,
    setContent,
    contentRef
  );

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          uploadAndInsertImage(file);
        }
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      uploadAndInsertImage(file);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setContent(e.currentTarget.innerHTML);
  };

  const handleSubmit = async (e?: FormEvent | React.MouseEvent) => {
    e?.preventDefault();

    if (loading) {
      alert("사용자 정보를 불러오는 중입니다.");
      return;
    }

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (title.trim() === "" || content.trim() === "" || content === "<br>") {
      alert("제목과 본문을 모두 입력해주세요.");
      return;
    }

    await submitPost({ title, content, user });

    setTitle("");
    setContent("");
    if (contentRef.current) contentRef.current.innerHTML = "";
  };

  return (
    <form className="w-full max-w-[800px] mx-auto mt-16 p-6 sm:p-10 bg-slate-900 rounded-2xl shadow-lg space-y-6 sm:space-y-8 text-slate-200">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-4 sm:mb-6">
        게시글 작성
      </h1>

      <div>
        <label className="block text-base sm:text-lg font-semibold text-slate-300 mb-1 sm:mb-2">
          제목
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="제목을 입력하세요"
          className="w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg text-sm sm:text-base bg-slate-800 text-slate-200 border-slate-700 focus:ring-2 focus:ring-sky-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-base sm:text-lg font-semibold text-slate-300 mb-1 sm:mb-2">
          본문
          <span className="text-xs sm:text-sm text-slate-400 ml-1 sm:ml-2">
            (이미지: Ctrl+V 또는 드래그&드롭)
          </span>
        </label>
        <div
          ref={contentRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="w-full min-h-[200px] sm:min-h-[300px] px-3 py-2 sm:px-4 sm:py-3 border rounded-lg resize-y text-sm sm:text-base leading-relaxed bg-slate-800 text-slate-200 border-slate-700 focus:ring-2 focus:ring-sky-500 focus:outline-none overflow-auto"
          suppressContentEditableWarning
          spellCheck={false}
          role="textbox"
          aria-multiline="true"
        />
      </div>

      <div className="pt-2 flex justify-center sm:justify-start">
        <Button01 caption="등록하기" bg_color="blue" onClick={handleSubmit} />
      </div>
    </form>
  );
};

export default PostForm;
