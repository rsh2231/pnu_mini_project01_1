"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFetchUser } from "@/hooks/useFetchUser";
import Button01 from "@/components/etc/Button01";
import { toast } from "react-toastify";

const springurl = process.env.NEXT_PUBLIC_SPRING_API;

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  const { user, loading: loadingUser } = useFetchUser();

  useEffect(() => {
  if (!id || loadingUser) return;

  const fetchPost = async () => {
    try {
      const res = await fetch(`${springurl}/api/post/${id}`);
      const data = await res.json();
      const ds = data.content.dashboard;

      // 작성자 확인 로직 추가
      if (user && user.nickname !== ds.nickname) {
        toast.error("작성자만 수정할 수 있습니다.");
        router.replace(`/dashboard/${id}`); // 수정 페이지 접근 차단
        return;
      }

      setTitle(ds.title);
      setContent(ds.content);
      if (contentRef.current) {
        contentRef.current.innerHTML = ds.content;
      }
    } catch (e) {
      console.error(e);
      toast.error("게시글 불러오기 실패");
    }
  };

  if (user) {
    fetchPost();
  }
}, [id, user, loadingUser]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setContent(e.currentTarget.innerHTML);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          const reader = new FileReader();
          reader.onload = () => {
            const imgTag = `<img src="${reader.result}" alt="이미지" style="max-width:100%;" />`;
            document.execCommand("insertHTML", false, imgTag);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const imgTag = `<img src="${reader.result}" alt="이미지" style="max-width:100%;" />`;
        document.execCommand("insertHTML", false, imgTag);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!user) return alert("로그인이 필요합니다.");
    const payload = {
      caller: "next",
      receiver: "spring",
      status: 200,
      method: "POST",
      URL: `/api/posts/${id}`,
      message: "게시글 수정 요청",
      content: {
        dashboard: {
          dashId: Number(id),
          title,
          content,
          username: user.username,
          nickname: user.nickname,
        },
      },
    };
    try {
      const res = await fetch(`${springurl}/api/post/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("실패");
      toast.success("수정 완료");
      router.push(`/dashboard/${id}`);
    } catch (err) {
      toast.error("수정 중 오류 발생");
    }
  };

  return (
    <form className="w-full max-w-[800px] mx-auto mt-16 p-6 sm:p-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl space-y-6 text-slate-200 border border-slate-700">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-6">게시글 수정</h2>

      {/* 제목 */}
      <div>
        <label className="block text-lg font-semibold mb-2">제목</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-800 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none"
        />
      </div>

      {/* 툴바 */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <button type="button" onClick={() => document.execCommand("bold")} className="toolbar-btn">🅱</button>
        <button type="button" onClick={() => document.execCommand("italic")} className="toolbar-btn">𝑖</button>
        <button type="button" onClick={() => document.execCommand("underline")} className="toolbar-btn">U̲</button>
        <button type="button" onClick={() => document.execCommand("strikeThrough")} className="toolbar-btn">S̶</button>
        <select onChange={(e) => document.execCommand("fontSize", false, e.target.value)} className="toolbar-select">
          <option value="3">보통</option>
          <option value="5">크게</option>
        </select>
        <input
          type="color"
          onChange={(e) => document.execCommand("foreColor", false, e.target.value)}
          className="toolbar-color"
        />
        <button type="button" onClick={() => document.execCommand("justifyLeft")} className="toolbar-btn">←</button>
        <button type="button" onClick={() => document.execCommand("justifyCenter")} className="toolbar-btn">↔</button>
        <button type="button" onClick={() => document.execCommand("justifyRight")} className="toolbar-btn">→</button>
      </div>

      {/* 본문 */}
      <div>
        <label className="block text-lg font-semibold mb-2">본문</label>
        <div
          ref={contentRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="w-full min-h-[250px] px-4 py-3 border border-slate-600 rounded-xl bg-slate-800 text-slate-100 resize-y overflow-auto"
          suppressContentEditableWarning
          spellCheck={false}
        />
      </div>

      {/* 수정 버튼 */}
      <div className="pt-2 flex justify-center sm:justify-end">
        <Button01 caption="수정 완료" bg_color="blue" onClick={handleUpdate} />
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
          border: none;
          background: transparent;
        }
      `}</style>
    </form>
  );
}
