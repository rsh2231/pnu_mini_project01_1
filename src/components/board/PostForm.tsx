"use client";

import React, { useState, useRef, FormEvent } from "react";
import { useFetchUser } from "@/hooks/useFetchUser";
import { usePostSubmit } from "@/hooks/usePostSubmit";
import { useImageUpload } from "@/hooks/useImageUpload";
import Button01 from "@/components/etc/Button01";
import { toast } from "react-toastify";

const PostForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  const { user, loading } = useFetchUser();
  const { submitPost } = usePostSubmit();
  const { uploadAndInsertImage } = useImageUpload(content, setContent, contentRef);

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
      toast.info("사용자 정보를 불러오는 중입니다.");
      return;
    }

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (title.trim() === "" || content.trim() === "" || content === "<br>") {
      toast.info("제목과 본문을 모두 입력해주세요.");
      return;
    }

    await submitPost({ title, content, user });

    setTitle("");
    setContent("");
    if (contentRef.current) contentRef.current.innerHTML = "";
  };

  return (
    <form className="w-full max-w-[800px] mx-auto mt-16 p-6 sm:p-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl space-y-6 sm:space-y-8 text-slate-200 backdrop-blur-md border border-slate-700">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-white mb-4 sm:mb-6">
        게시글 작성
      </h1>

      {/* 제목 */}
      <div>
        <label className="block text-lg sm:text-xl font-semibold text-slate-300 mb-2">
          제목
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="제목을 입력하세요"
          className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-none text-base"
        />
      </div>

      {/* 툴바 */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <button type="button" onClick={() => document.execCommand("bold")} className="toolbar-btn">🅱</button>
        <button type="button" onClick={() => document.execCommand("italic")} className="toolbar-btn">𝑖</button>
        <button type="button" onClick={() => document.execCommand("underline")} className="toolbar-btn">U̲</button>
        <button type="button" onClick={() => document.execCommand("strikeThrough")} className="toolbar-btn">S̶</button>

        <select
          onChange={(e) => document.execCommand("fontSize", false, e.target.value)}
          className="toolbar-select"
          defaultValue=""
        >
          <option value="" disabled>크기</option>
          <option value="2">작게</option>
          <option value="3">보통</option>
          <option value="5">크게</option>
        </select>

        <input
          type="color"
          onChange={(e) => document.execCommand("foreColor", false, e.target.value)}
          className="toolbar-color"
          title="글자 색상"
        />

        <button type="button" onClick={() => document.execCommand("justifyLeft")} className="toolbar-btn">←</button>
        <button type="button" onClick={() => document.execCommand("justifyCenter")} className="toolbar-btn">↔</button>
        <button type="button" onClick={() => document.execCommand("justifyRight")} className="toolbar-btn">→</button>
      </div>

      {/* 본문 */}
      <div>
        <label className="block text-lg sm:text-xl font-semibold text-slate-300 mb-2">
          본문
          <span className="text-xs sm:text-sm text-slate-400 ml-2">
            (이미지: 붙여넣기 또는 드래그)
          </span>
        </label>
        <div
          ref={contentRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="w-full min-h-[250px] px-4 py-3 border border-slate-600 rounded-xl bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-none leading-relaxed resize-y overflow-auto text-base"
          suppressContentEditableWarning
          spellCheck={false}
        />
      </div>

      {/* 버튼 */}
      <div className="pt-2 flex justify-center sm:justify-end">
        <Button01 caption="등록하기" bg_color="blue" onClick={handleSubmit} />
      </div>

      {/* 툴바 스타일 */}
      <style jsx>{`
    .toolbar-btn {
      padding: 6px 12px;
      background-color: #1e293b;
      color: #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .toolbar-btn:hover {
      background-color: #334155;
    }
    .toolbar-select {
      background-color: #1e293b;
      color: white;
      border-radius: 6px;
      padding: 6px 8px;
      font-size: 0.875rem;
      border: none;
    }
    .toolbar-color {
      width: 32px;
      height: 32px;
      background: transparent;
      border: none;
    }
  `}</style>
    </form>
  );
};

export default PostForm;
