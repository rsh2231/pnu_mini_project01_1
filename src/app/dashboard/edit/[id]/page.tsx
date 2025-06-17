"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFetchUser } from "@/hooks/useFetchUser";
import Button01 from "@/components/etc/Button01";

const springurl = process.env.SPRING_API;

const EditPostPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState({ title: "", content: "" });

  const { user, loading: loadingUser } = useFetchUser();

  // 게시글 불러오기
  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`${springurl}/api/post/${id}`);
        if (!res.ok) throw new Error("게시글 요청 실패");

        const data = await res.json();
        const ds = data.content.dsboard;
        setPost({ title: ds.title, content: ds.content });
      } catch (error) {
        alert("게시글을 불러오지 못했습니다.");
        console.error(error);
      }
    };

    fetchPost();
  }, [id]);

  const handleUpdate = async () => {
    if (loadingUser) return alert("사용자 정보를 불러오는 중입니다.");
    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/src/components/UI/Login/LoginModal.tsx");
      return;
    }

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
          title: post.title,
          content: post.content,
          username: user.username,
          nickname: user.nickname,
        },
      },
    };

    try {
      const res = await fetch(`${springurl}/api/post/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("수정 실패");

      alert("수정되었습니다.");
      router.push(`/dashboard/${id}`);
    } catch (err) {
      alert("수정 중 오류 발생");
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6 bg-slate-900 rounded-xl shadow-md px-6 text-slate-200">
      <h2 className="text-3xl font-extrabold text-white mb-4">게시글 수정</h2>

      <input
        type="text"
        value={post.title}
        onChange={(e) => setPost({ ...post, title: e.target.value })}
        placeholder="제목"
        className="w-full p-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
      />

      <textarea
        value={post.content}
        onChange={(e) => setPost({ ...post, content: e.target.value })}
        placeholder="내용"
        rows={10}
        className="w-full p-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm resize-y"
      />

      <Button01
        caption="수정 완료"
        bg_color="blue"
        onClick={handleUpdate}
      />
    </div>
  );
};

export default EditPostPage;
