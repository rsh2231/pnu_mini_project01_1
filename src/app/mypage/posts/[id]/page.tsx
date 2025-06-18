"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
  content: string;
  date: string;
};

const dummyData: Post[] = [
  {
    id: 1,
    title: "책장 나눔합니다",
    content: "3단 책장 상태 양호합니다. 성북구 직거래 원해요.",
    date: "2025-06-18",
  },
  {
    id: 2,
    title: "의자 필요하신 분",
    content: "사무용 의자, 약간 사용감 있음. 무료 나눔해요.",
    date: "2025-06-17",
  },
];

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const found = dummyData.find((p) => p.id === Number(params.id));
    if (found) {
      setPost(found);
    } else {
      // 없는 게시글이면 리스트로 되돌림
      router.push("/mypage/posts");
    }
  }, [params.id, router]);

  if (!post) return null;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl text-gray-700 font-bold">{post.title}</h1>
      <p className="text-sm text-gray-500">{post.date}</p>
      <p className="mt-4  text-gray-500">{post.content}</p>
      <button
        onClick={() => router.push("/mypage/posts")}
        className="mt-6 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
      >
        목록으로
      </button>
    </div>
  );
}
